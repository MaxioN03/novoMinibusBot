"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const { Composer } = require('micro-bot');
// import {Telegraf} from "telegraf";
const redux_1 = require("redux");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const rootReducer_1 = __importDefault(require("./store/reducers/rootReducer"));
const handlers_1 = __importDefault(require("./bot/handlers"));
exports.store = (0, redux_1.createStore)(rootReducer_1.default, { bot: null }, (0, redux_1.applyMiddleware)(redux_thunk_1.default));
const bot = new Composer();
// const TOKEN = '';
// const bot = new Telegraf(TOKEN);
(0, handlers_1.default)(bot);
exports.store.dispatch({ type: 'ADD_CREATED_BOT', payload: bot });
module.exports = bot;
// bot.launch().then(() => {
//     console.log('Bot is launched!');
// });
