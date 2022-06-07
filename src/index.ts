const {Composer} = require('micro-bot');
// import {Telegraf} from "telegraf";
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from "./store/reducers/rootReducer";
import applyBotHandlers from "./bot/handlers";

export const store = createStore(rootReducer, {bot: null}, applyMiddleware(thunk));

const bot = new Composer();
// const TOKEN = '';
// const bot = new Telegraf(TOKEN);

applyBotHandlers(bot);

store.dispatch({type: 'ADD_CREATED_BOT', payload: bot});

module.exports = bot;
// bot.launch().then(() => {
//     console.log('Bot is launched!');
// });