const {Telegraf} = require('telegraf');
const {Markup} = Telegraf;
const moment = require('moment');
const {getAllTrips} = require('./js/tripsFetcher');
const {DIRECTIONS, STATIONS, ONE_MINUTE, MAX_VISIBILITY_DAYS, DAY_OF_WEEK_SHORT_TRANSLATIONS} = require(
    './js/constants');
const {getMessageWithTrips, isMessageUserAllowed, getDirectionString} = require(
    './js/utils');
const {TRACK_KEY, DIRECTION_KEY, DIRECTION_REGEX, DATE_KEY} = require(
    './js/commands');

const {Composer} = require('micro-bot');
const bot = new Composer();

let timer = null;
let direction = null;
let date = null;

bot.command(TRACK_KEY, (ctx) => {
  if (isMessageUserAllowed(ctx)) {
    const inlineMessageDirectionsKeyboard = Markup.inlineKeyboard([
      Markup.callbackButton(`${STATIONS.MINSK} → ${STATIONS.NOVO}`,
          `${DIRECTION_KEY}_${DIRECTIONS.toNovogrudok}`),
      Markup.callbackButton(`${STATIONS.NOVO} → ${STATIONS.MINSK}`,
          `${DIRECTION_KEY}_${DIRECTIONS.toMinsk}`),
    ]).extra();

    ctx.reply(
        'Укажите направление',
        inlineMessageDirectionsKeyboard);
  }
});

bot.action(DIRECTION_REGEX, (ctx) => {
  let selectedDirection = ctx.match.input.split('_')[1];

  let dates = [];
  for (let i = 0; i < MAX_VISIBILITY_DAYS; i++) {
    let currentDay = moment();
    let date = currentDay.add(i, 'days');
    let dayString = date.format('DD-MM-YYYY');
    let dowString = date.format('dddd');
    let dowLocaleString = dowString.toLowerCase() &&
    DAY_OF_WEEK_SHORT_TRANSLATIONS &&
    DAY_OF_WEEK_SHORT_TRANSLATIONS[dowString.toLowerCase()]
        ? DAY_OF_WEEK_SHORT_TRANSLATIONS[dowString.toLowerCase()]
        : null;
    dates.push(`${dayString}${dowLocaleString ? `, ${dowLocaleString}` : ''}`);
  }
  let buttons = dates.reduce((result, date) => {

    let button = Markup.callbackButton(date, `${DATE_KEY}_${date}`);

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
  const inlineMessageDateKeyboard = Markup.inlineKeyboard(buttons).extra();

  direction = selectedDirection;
  ctx.editMessageText(getDirectionString(direction, false));

  ctx.reply(
      'Укажите дату',
      inlineMessageDateKeyboard);
});

const sendTripsInfo = (ctx) => {
  getAllTrips(direction, date).then(response => {

    let message = `${getDirectionString(direction, true)}\n`
        + `*Дата*: ${date}\n\n`;

    message += getMessageWithTrips(response);

    ctx.replyWithMarkdown(message);
  });
};

bot.action(/date_\d{2}.\d{2}.\d{4}/ig, (ctx) => {
  date = ctx.match[0].split('_')[1];
  ctx.editMessageText(`Дата: ${date}`);
  ctx.reply('Начинаю отслеживание...');

  sendTripsInfo(ctx);

  timer = setInterval(() => {
    sendTripsInfo(ctx);
  }, ONE_MINUTE);
});

bot.command('stop', (ctx) => {
  if (isMessageUserAllowed(ctx)) {
    clearInterval(timer);
  }
});

module.exports = bot;