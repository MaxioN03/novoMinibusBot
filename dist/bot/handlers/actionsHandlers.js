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
exports.onDateHandler = exports.onDirectionHandler = void 0;
const index_1 = require("../../index");
const telegraf_1 = require("telegraf");
const utils_1 = require("../../js/utils");
const constants_1 = require("../../js/constants");
const commands_1 = require("../../js/commands");
const moment = require("moment");
const onUserTripsTimersUpdate_1 = __importDefault(require("../../js/onUserTripsTimersUpdate"));
const onDirectionHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let splittedAction = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.match) === null || _a === void 0 ? void 0 : _a.input.split('_');
    let selectedDirection = splittedAction === null || splittedAction === void 0 ? void 0 : splittedAction[1];
    let dates = [];
    for (let i = 0; i < constants_1.MAX_VISIBILITY_DAYS; i++) {
        let currentDay = moment();
        let date = currentDay.add(i, 'days');
        let dayString = date.format('DD-MM-YYYY');
        let dowString = date.format('dddd');
        let dowLocaleString = dowString.toLowerCase() &&
            constants_1.DAY_OF_WEEK_SHORT_TRANSLATIONS &&
            constants_1.DAY_OF_WEEK_SHORT_TRANSLATIONS[dowString.toLowerCase()]
            ? constants_1.DAY_OF_WEEK_SHORT_TRANSLATIONS[dowString.toLowerCase()]
            : null;
        dates.push(`${dayString}${dowLocaleString
            ? `, ${dowLocaleString}`
            : ''}`);
    }
    let buttons = dates.reduce((result, date) => {
        let button = telegraf_1.Markup.callbackButton(date, `${commands_1.DATE_KEY}_${date}`);
        if (result.length === 0) {
            result.push([button]);
        }
        else {
            if (result[result.length - 1].length === 2) {
                result.push([button]);
            }
            else {
                result[result.length - 1].push(button);
            }
        }
        return result;
    }, []);
    const inlineMessageDateKeyboard = telegraf_1.Markup.inlineKeyboard(buttons).extra();
    let id = yield (0, utils_1.getChatId)(ctx);
    index_1.store.dispatch({ type: 'ADD_USER_DIRECTION', payload: { id, selectedDirection } });
    ctx.editMessageText((0, utils_1.getDirectionString)(selectedDirection, false));
    ctx.reply('Укажите дату', inlineMessageDateKeyboard);
});
exports.onDirectionHandler = onDirectionHandler;
const onDateHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let splittedAction = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.match) === null || _b === void 0 ? void 0 : _b[0].split('_');
    let dateFull = splittedAction === null || splittedAction === void 0 ? void 0 : splittedAction[1];
    ctx.editMessageText(`Дата: ${dateFull}`);
    let id = yield (0, utils_1.getChatId)(ctx);
    index_1.store.dispatch({ type: 'ADD_USER_DATE', payload: { id, selectedDate: dateFull === null || dateFull === void 0 ? void 0 : dateFull.split(',')[0] } });
    index_1.store.dispatch({ type: 'ADD_USER_TIMER', payload: { id, tmpUserTrip: index_1.store.getState().TMPUserTripsRequestState[id] } });
    index_1.store.dispatch({ type: 'REMOVE_USER', payload: { id } });
    (0, onUserTripsTimersUpdate_1.default)(id);
});
exports.onDateHandler = onDateHandler;
