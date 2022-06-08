"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatId = exports.isTripsResultEqual = exports.getDirectionString = exports.getMessageWithTrips = exports.getDirection = void 0;
const constants_1 = require("./constants");
//stations: [string, string]
const getDirection = (stations) => {
    let formattedStations = stations.map((station) => station.trim().toLowerCase());
    if (formattedStations[0] === constants_1.STATIONS.NOVO.toLowerCase() &&
        formattedStations[1] === constants_1.STATIONS.MINSK.toLowerCase()) {
        return constants_1.DIRECTIONS.toMinsk;
    }
    if (formattedStations[0] === constants_1.STATIONS.MINSK.toLowerCase() &&
        formattedStations[1] === constants_1.STATIONS.NOVO.toLowerCase()) {
        return constants_1.DIRECTIONS.toNovogrudok;
    }
    return null;
};
exports.getDirection = getDirection;
const getMessageWithTrips = (trips) => {
    const getSeatsString = (seatsCount) => {
        let end = '';
        if (seatsCount === 1) {
            end = 'место';
        }
        else if (seatsCount >= 2 && seatsCount <= 4) {
            end = 'места';
        }
        else {
            end = 'мест';
        }
        return `${seatsCount} ${end}`;
    };
    const getAgentString = (agent) => {
        if (agent === constants_1.AGENTS.alfa) {
            return `[${agent}](https://alfa-bus.by/)`;
        }
        else {
            let { date, direction } = trips[0];
            let directionUrlString = direction === constants_1.DIRECTIONS.toNovogrudok
                ? `${constants_1.STATIONS.MINSK}/${constants_1.STATIONS.NOVO}`
                : `${constants_1.STATIONS.NOVO}/${constants_1.STATIONS.MINSK}`;
            let dateUrlString = `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;
            let url = `https://atlasbus.by/Маршруты/${directionUrlString}?date=${dateUrlString}&passengers=1`;
            return `[${agent}](${url})`;
        }
    };
    return trips.reduce((result, trip) => {
        let { agent, departureTime, freeSeats, price } = trip;
        result += `*${departureTime}* ${getAgentString(agent)}\n`
            + `*${getSeatsString(freeSeats)}*, ${price} BYN\n\n`;
        return result;
    }, '');
};
exports.getMessageWithTrips = getMessageWithTrips;
//direction: DIRECTIONS, withMarkdown: boolean
const getDirectionString = (direction, withMarkdown) => {
    return `${withMarkdown
        ? '*Направление*'
        : 'Направление'}: ${direction === constants_1.DIRECTIONS.toMinsk
        ? `${constants_1.STATIONS.NOVO} → ${constants_1.STATIONS.MINSK}`
        : `${constants_1.STATIONS.MINSK} → ${constants_1.STATIONS.NOVO}`}`;
};
exports.getDirectionString = getDirectionString;
//tripsResult: trip[][]
const isTripsResultEqual = (tripsResult1, tripsResult2) => {
    if ((tripsResult1 === null && tripsResult2 !== null) ||
        (tripsResult1 !== null && tripsResult2 === null)) {
        return false;
    }
    if (tripsResult1.length !== tripsResult2.length) {
        return false;
    }
    if (Array.isArray(tripsResult1)) {
        let reducedTripsResult1 = tripsResult1 && tripsResult1.reduce((result, tripsResult1Item) => {
            result.push(...tripsResult1Item);
            return result;
        }, []) || [];
        let reducedTripsResult2 = tripsResult2 && tripsResult2.reduce((result, tripsResult2Item) => {
            result.push(...tripsResult2Item);
            return result;
        }, []) || [];
        return reducedTripsResult1.every((tripsResult1Item, index) => {
            let { departureTime: departureTime1, freeSeats: freeSeats1, price: price1, } = tripsResult1Item || {};
            let { departureTime: departureTime2, freeSeats: freeSeats2, price: price2, } = reducedTripsResult2[index] ||
                {};
            return departureTime1 === departureTime2
                && freeSeats1 === freeSeats2
                && price1 === price2;
        });
    }
    else if (Array.isArray(tripsResult2)) {
        let reducedTripsResult1 = tripsResult1 && tripsResult1.reduce((result, tripsResult1Item) => {
            result.push(...tripsResult1Item);
            return result;
        }, []) || [];
        let reducedTripsResult2 = tripsResult2 && tripsResult2.reduce((result, tripsResult2Item) => {
            result.push(...tripsResult2Item);
            return result;
        }, []) || [];
        return reducedTripsResult2.every((tripsResult2Item, index) => {
            let { departureTime: departureTime1, freeSeats: freeSeats1, price: price1, } = reducedTripsResult1[index] ||
                {};
            let { departureTime: departureTime2, freeSeats: freeSeats2, price: price2, } = tripsResult2Item || {};
            return departureTime1 === departureTime2
                && freeSeats1 === freeSeats2
                && price1 === price2;
        });
    }
};
exports.isTripsResultEqual = isTripsResultEqual;
const getChatId = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = yield ctx.getChat();
    return id;
});
exports.getChatId = getChatId;
