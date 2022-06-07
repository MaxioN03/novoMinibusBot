import {AGENTS, DIRECTIONS, STATIONS} from "./constants";

//stations: [string, string]
export const getDirection = (stations: any) => {
  let formattedStations = stations.map((station: any) => station.trim().toLowerCase());
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

export const getMessageWithTrips = (trips: any[]) => {
  const getSeatsString = (seatsCount: any) => {
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

  const getAgentString = (agent: any) => {
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

//direction: DIRECTIONS, withMarkdown: boolean
export const getDirectionString = (direction: any, withMarkdown: any) => {
  return `${withMarkdown
      ? '*Направление*'
      : 'Направление'}: ${direction === DIRECTIONS.toMinsk
      ? `${STATIONS.NOVO} → ${STATIONS.MINSK}`
      : `${STATIONS.MINSK} → ${STATIONS.NOVO}`}`;
};

//tripsResult: trip[][]
export const isTripsResultEqual = (tripsResult1: any, tripsResult2: any) => {

  if ((tripsResult1 === null && tripsResult2 !== null) ||
      (tripsResult1 !== null && tripsResult2 === null)) {
    return false;
  }

  if (tripsResult1.length !== tripsResult2.length) {
    return false;
  }

  if (Array.isArray(tripsResult1)) {
    let reducedTripsResult1 = tripsResult1 && tripsResult1.reduce(
        (result, tripsResult1Item) => {
          result.push(...tripsResult1Item);
          return result;
        }, []) || [];

    let reducedTripsResult2 = tripsResult2 && tripsResult2.reduce(
        (result: any, tripsResult2Item: any) => {
          result.push(...tripsResult2Item);
          return result;
        }, []) || [];

    return reducedTripsResult1.every((tripsResult1Item: any, index: number) => {
      let {
        departureTime: departureTime1,
        freeSeats: freeSeats1,
        price: price1,
      } = tripsResult1Item || {};
      let {
        departureTime: departureTime2,
        freeSeats: freeSeats2,
        price: price2,
      } = reducedTripsResult2[index] ||
      {};

      return departureTime1 === departureTime2
          && freeSeats1 === freeSeats2
          && price1 === price2;
    });

  } else if (Array.isArray(tripsResult2)) {
    let reducedTripsResult1 = tripsResult1 && tripsResult1.reduce(
        (result: any, tripsResult1Item: any) => {
          result.push(...tripsResult1Item);
          return result;
        }, []) || [];

    let reducedTripsResult2 = tripsResult2 && tripsResult2.reduce(
        (result, tripsResult2Item) => {
          result.push(...tripsResult2Item);
          return result;
        }, []) || [];

    return reducedTripsResult2.every((tripsResult2Item: any, index: any) => {
      let {
        departureTime: departureTime1,
        freeSeats: freeSeats1,
        price: price1,
      } = reducedTripsResult1[index] ||
      {};
      let {
        departureTime: departureTime2,
        freeSeats: freeSeats2,
        price: price2,
      } = tripsResult2Item || {};

      return departureTime1 === departureTime2
          && freeSeats1 === freeSeats2
          && price1 === price2;
    });
  }
};

export const getChatId = async (ctx: any) => {
  let {id} = await ctx.getChat();
  return id;
};