const {AGENTS, DIRECTIONS, STATIONS} = require('./constants');

//stations: [string, string]
const getDirection = (stations) => {
  let formattedStations = stations.map(station => station.trim().toLowerCase());
  if (formattedStations[0] === STATIONS.NOVO.toLowerCase() &&
      formattedStations[1] === STATIONS.MINSK.toLowerCase()) {
    return DIRECTIONS.toMinsk;
  }
  if (formattedStations[0] === STATIONS.MINSK.toLowerCase() &&
      formattedStations[1] === STATIONS.NOVO.toLowerCase()) {
    return DIRECTIONS.toNovogrudok;
  }

  return null;
};

const getMessageWithTrips = (trips) => {
  const getSeatsString = (seatsCount) => {
    let end = '';
    if (seatsCount === 1) {
      end = 'место';
    } else if (seatsCount >= 2 && seatsCount <= 4) {
      end = 'места';
    } else {
      end = 'мест';
    }

    return `${seatsCount} ${end}`;
  };

  const getAgentString = (agent) => {
    if (agent === AGENTS.alfa) {
      return `[${agent}](https://alfa-bus.by/)`;
    }
    else {
      let {date, direction} = trips[0];

      let directionUrlString = direction === DIRECTIONS.toNovogrudok
          ? `${STATIONS.MINSK}/${STATIONS.NOVO}`
          : `${STATIONS.NOVO}/${STATIONS.MINSK}`;
      let dateUrlString = `${date.split('-')[2]}-${date.split(
          '-')[1]}-${date.split('-')[0]}`;

      let url = `https://atlasbus.by/Маршруты/${directionUrlString}?date=${dateUrlString}&passengers=1`;

      return `[${agent}](${url})`;
    }
  };

  return trips.reduce((result, trip) => {
    let {agent, departureTime, freeSeats, price} = trip;

    result += `*${departureTime}* ${getAgentString(agent)}\n`
        + `*${getSeatsString(freeSeats)}*, ${price} BYN\n\n`;

    return result;
  }, '');
};

const isMessageUserAllowed = (ctx) => {
  let user = ctx && ctx.update && ctx.update.message && ctx.update.message.from
      && ctx.update.message.from.username || null;

  return user && ALLOWED_USERS.includes(user);
};

//direction: DIRECTIONS, withMarkdown: boolean
const getDirectionString = (direction, withMarkdown) => {
  return `${withMarkdown
      ? '*Направление*'
      : 'Направление'}: ${direction === DIRECTIONS.toMinsk
      ? `${STATIONS.NOVO} → ${STATIONS.MINSK}`
      : `${STATIONS.MINSK} → ${STATIONS.NOVO}`}`;
};

module.exports = {
  getDirection,
  getMessageWithTrips,
  isMessageUserAllowed,
  getDirectionString,
};