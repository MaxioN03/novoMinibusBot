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
exports.onStopHandler = exports.onTrackDiffHandler = exports.onTrackHandler = void 0;
const index_1 = require("../../index");
const telegraf_1 = require("telegraf");
const utils_1 = require("../../js/utils");
const constants_1 = require("../../js/constants");
const commands_1 = require("../../js/commands");
const onTrackHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const inlineMessageDirectionsKeyboard = telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.callbackButton(`${constants_1.STATIONS.MINSK} → ${constants_1.STATIONS.NOVO}`, `${commands_1.DIRECTION_KEY}_${constants_1.DIRECTIONS.toNovogrudok}`),
        telegraf_1.Markup.callbackButton(`${constants_1.STATIONS.NOVO} → ${constants_1.STATIONS.MINSK}`, `${commands_1.DIRECTION_KEY}_${constants_1.DIRECTIONS.toMinsk}`),
    ]).extra();
    let id = yield (0, utils_1.getChatId)(ctx);
    index_1.store.dispatch({ type: 'ADD_USER_TRACK', payload: { id } });
    ctx.reply('Укажите направление', inlineMessageDirectionsKeyboard);
});
exports.onTrackHandler = onTrackHandler;
const onTrackDiffHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const inlineMessageDirectionsKeyboard = telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.callbackButton(`${constants_1.STATIONS.MINSK} → ${constants_1.STATIONS.NOVO}`, `${commands_1.DIRECTION_KEY}_${constants_1.DIRECTIONS.toNovogrudok}`),
        telegraf_1.Markup.callbackButton(`${constants_1.STATIONS.NOVO} → ${constants_1.STATIONS.MINSK}`, `${commands_1.DIRECTION_KEY}_${constants_1.DIRECTIONS.toMinsk}`),
    ]).extra();
    let id = yield (0, utils_1.getChatId)(ctx);
    index_1.store.dispatch({ type: 'ADD_USER_TRACK_DIFF', payload: { id } });
    ctx.reply('Укажите направление', inlineMessageDirectionsKeyboard);
});
exports.onTrackDiffHandler = onTrackDiffHandler;
const onStopHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let id = yield (0, utils_1.getChatId)(ctx);
    index_1.store.dispatch({ type: 'REMOVE_USER_TIMERS', payload: { id } });
});
exports.onStopHandler = onStopHandler;
