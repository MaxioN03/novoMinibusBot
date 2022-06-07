import {getDirectionString, getMessageWithTrips} from './utils';
import getAllTrips from './tripsFetcher';
import {store} from '../index';

const onUserTripsTimersUpdate = (id: string) => {
  const formatTripsMessage = (direction: string, date: string, trips: any) => {
    let message = '';

    message += `${getDirectionString(direction, true)}\n`
        + `*Дата*: ${date}\n\n`;

    message += trips.length
        ? getMessageWithTrips(trips)
        : '_Мест не найдено_\n\n';

    return message;
  };

  const getTripsInfoForUser = async (id: string, trips: any[]) => {
    return await trips.reduce(async (messagePrevious, trip) => {
      let message = await messagePrevious;

      let foundedTrips = store.getState().commonTripsState.find((tripInfoItem: any) => {
        return tripInfoItem.direction === trip.direction
            && tripInfoItem.date === trip.date;
      }) ?? null;

      if (foundedTrips) {
        if (+new Date() - foundedTrips.lastQueryTimestamp < 10000) {
          message += `_Беру из хеша_\n\n`;

          message += formatTripsMessage(trip.direction, trip.date,
              foundedTrips.trips);

        } else {
          message += `_Хеш устарел, ищу заново_\n\n`;
          let trips = await getAllTrips(trip.direction, trip.date);
          foundedTrips.trips = trips;
          foundedTrips.lastQueryTimestamp = +new Date();

          message += formatTripsMessage(trip.direction, trip.date, trips);
        }
      } else {
        message += `_Элемента нету. Ищу заново_\n\n`;

        let trips = await getAllTrips(trip.direction, trip.date);
        store.dispatch({
          type: 'ADD_COMMON_TRIPS', payload: {
            tripsInfo: {
              direction: trip.direction,
              date: trip.date,
              trips,
              lastQueryTimestamp: +new Date(),
            }
          }
        });

        message += formatTripsMessage(trip.direction, trip.date, trips);
      }

      return message;
    }, Promise.resolve(''));

  };

  let currentUserObject = store.getState().userTripsRequestTimersState[id];
  clearTimeout(currentUserObject.timer);

  currentUserObject.timer = setInterval(async () => {
    let message = await getTripsInfoForUser(id, currentUserObject.trips);
    let bot = store.getState().bot;
    bot.telegram.sendMessage(id, message, {parse_mode: 'Markdown'});
  }, 10000);
};

export default onUserTripsTimersUpdate;