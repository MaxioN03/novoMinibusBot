const axios = require('axios');
const moment = require('moment');
const {AGENTS, DIRECTIONS} = require('./constants');
const {getDirection} = require('./utils');

const ALFA_BUS_ARROW_TRIP_SPLITTER = ' -> ';

//(direction: DIRECTIONS, date: string)
const getAlfaBusTrips = (direction, date) => {
  const params = new URLSearchParams();
  params.append('date',
      `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`);

  return axios({
    method: 'post',
    url: 'https://alfa-bus.by/timetable/trips/',
    responseType: 'json',
    data: params,
  })
      .then(function(response) {
        let tripsObject = response && response.data && response.data.data &&
            response.data.data.trips || {};
        let trips = Object.values(tripsObject);

        return trips.filter(trip => {
          let {date: tripDate, route, seats, datetime} = trip;
          let tripStations = route.split(ALFA_BUS_ARROW_TRIP_SPLITTER);
          let tripDirection = getDirection(tripStations);

          return tripDirection === direction
              && date === tripDate
              && +(new Date(datetime)) > +(new Date())
              && seats > 0;
        })
            .sort((trip1, trip2) => {
              let {datetime: datetime1} = trip1;
              let {datetime: datetime2} = trip2;

              return datetime1.localeCompare(datetime2);
            })
            .map(trip => {
              let {date: tripDate, route, seats, departure_time, price} = trip;
              let tripStations = route.split(ALFA_BUS_ARROW_TRIP_SPLITTER);
              let tripDirection = getDirection(tripStations);

              return {
                direction: tripDirection,
                date: tripDate,
                departureTime: departure_time,
                freeSeats: seats,
                price,
                agent: AGENTS.alfa,
              };
            });
      });
};

//(direction: DIRECTIONS, date: string)
const getAtlasBusTrips = (direction, date) => {
  const ATLAS_MINSK_ID = 'c625144';
  const ATLAS_NOVOGRUDOK_ID = 'c624785';

  date = `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;

  let from_id = ATLAS_MINSK_ID;
  let to_id = ATLAS_NOVOGRUDOK_ID;
  if (direction === DIRECTIONS.toMinsk) {
    from_id = ATLAS_NOVOGRUDOK_ID;
    to_id = ATLAS_MINSK_ID;
  }

  let url = `https://atlasbus.by/api/search?from_id=${from_id}&to_id=${to_id}&calendar_width=30&date=${date}&passengers=1`;

  return axios({
    method: 'get',
    url,
    responseType: 'json',
  })
      .then(response => {
        let rides = response.data.rides;

        if (rides.length === 0) {
          return axios({
            method: 'get',
            url,
            responseType: 'json',
          })
              .then(response => {
                let rides = response.data.rides;

                if (rides.length === 0) {
                  return axios({
                    method: 'get',
                    url,
                    responseType: 'json',
                  })
                      .then(response => {
                        let rides = response.data.rides;

                        return rides
                            .map(trip => {
                              let {from, to, departure, freeSeats, price} = trip;

                              return {
                                direction: getDirection([from.desc, to.desc]),
                                date: moment(departure).format('DD-MM-YYYY'),
                                departureTime: moment(departure)
                                    .format('HH:mm'),
                                freeSeats: freeSeats,
                                price: price,
                                agent: AGENTS.atlas,
                              };
                            })
                            .filter(trip => trip.freeSeats > 0);
                      });
                }
                else {
                  return rides
                      .map(trip => {
                        let {from, to, departure, freeSeats, price} = trip;

                        return {
                          direction: getDirection([from.desc, to.desc]),
                          date: moment(departure).format('DD-MM-YYYY'),
                          departureTime: moment(departure).format('HH:mm'),
                          freeSeats: freeSeats,
                          price: price,
                          agent: AGENTS.atlas,
                        };
                      })
                      .filter(trip => trip.freeSeats > 0);
                }
              });
        }
        else {
          return rides
              .map(trip => {
                let {from, to, departure, freeSeats, price} = trip;

                return {
                  direction: getDirection([from.desc, to.desc]),
                  date: moment(departure).format('DD-MM-YYYY'),
                  departureTime: moment(departure).format('HH:mm'),
                  freeSeats: freeSeats,
                  price: price,
                  agent: AGENTS.atlas,
                };
              })
              .filter(trip => trip.freeSeats > 0);
        }
      });
};

const getAllTrips = (direction, date) => {
  return Promise.all([
    getAlfaBusTrips(direction, date),
    getAtlasBusTrips(direction, date),
  ])
      .then(response => {
        let [alfaBusTrips, atlasTrips] = response;

        let allTrips = [...alfaBusTrips, ...atlasTrips];

        allTrips.forEach(trip => {
          let {price} = trip;
          let priceNumeric = +price;

          trip.price = priceNumeric.toFixed(2)
        });

        allTrips.sort((trip1, trip2) => {
          let {date: date1, departureTime: departureTime1} = trip1;
          let departure1 = `${date1.split('-')[2]}-${date1.split(
              '-')[1]}-${date1.split('-')[0]} ${departureTime1}`;

          let {date: date2, departureTime: departureTime2} = trip2;
          let departure2 = `${date2.split('-')[2]}-${date2.split(
              '-')[1]}-${date2.split('-')[0]} ${departureTime2}`;

          return +moment(departure1) - +moment(departure2);
        });

        return allTrips;
      });
};

module.exports = {
  getAllTrips,
};