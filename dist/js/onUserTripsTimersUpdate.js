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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const tripsFetcher_1 = __importDefault(require("./tripsFetcher"));
const index_1 = require("../index");
const onUserTripsTimersUpdate = (id) => {
    const formatTripsMessage = (direction, date, trips) => {
        let message = '';
        message += `${(0, utils_1.getDirectionString)(direction, true)}\n`
            + `*Дата*: ${date}\n\n`;
        message += trips.length
            ? (0, utils_1.getMessageWithTrips)(trips)
            : '_Мест не найдено_\n\n';
        return message;
    };
    const getTripsInfoForUser = (id, trips) => __awaiter(void 0, void 0, void 0, function* () {
        return yield trips.reduce((messagePrevious, trip) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let message = yield messagePrevious;
            let foundedTrips = (_a = index_1.store.getState().commonTripsState.find((tripInfoItem) => {
                return tripInfoItem.direction === trip.direction
                    && tripInfoItem.date === trip.date;
            })) !== null && _a !== void 0 ? _a : null;
            if (foundedTrips) {
                if (+new Date() - foundedTrips.lastQueryTimestamp < 10000) {
                    message += `_Беру из хеша_\n\n`;
                    message += formatTripsMessage(trip.direction, trip.date, foundedTrips.trips);
                }
                else {
                    message += `_Хеш устарел, ищу заново_\n\n`;
                    let trips = yield (0, tripsFetcher_1.default)(trip.direction, trip.date);
                    foundedTrips.trips = trips;
                    foundedTrips.lastQueryTimestamp = +new Date();
                    message += formatTripsMessage(trip.direction, trip.date, trips);
                }
            }
            else {
                message += `_Элемента нету. Ищу заново_\n\n`;
                let trips = yield (0, tripsFetcher_1.default)(trip.direction, trip.date);
                index_1.store.dispatch({
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
        }), Promise.resolve(''));
    });
    let currentUserObject = index_1.store.getState().userTripsRequestTimersState[id];
    clearTimeout(currentUserObject.timer);
    currentUserObject.timer = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        let message = yield getTripsInfoForUser(id, currentUserObject.trips);
        let bot = index_1.store.getState().bot;
        bot.telegram.sendMessage(id, message, { parse_mode: 'Markdown' });
    }), 10000);
};
exports.default = onUserTripsTimersUpdate;
