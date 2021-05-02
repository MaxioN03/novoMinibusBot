const {Telegraf} = require('telegraf');
const {Markup} = Telegraf;
const moment = require('moment');
const {getAllTrips} = require('./js/tripsFetcher');
const {DIRECTIONS, STATIONS, ONE_MINUTE, MAX_VISIBILITY_DAYS, DAY_OF_WEEK_SHORT_TRANSLATIONS} = require(
    './js/constants');
const {getMessageWithTrips, isMessageUserAllowed, getDirectionString, isTripsResultEqual} = require(
    './js/utils');
const {TRACK_KEY, TRACK_DIFF_KEY, DIRECTION_KEY, DIRECTION_REGEX, DATE_KEY} = require(
    './js/commands');

const {Composer} = require('micro-bot');
const bot = new Composer();

let timer = null;
let direction = null;
let date = null;
let lastTripsResult = null; //last result for diff search

bot.command(TRACK_KEY, (ctx) => {
  if (isMessageUserAllowed(ctx)) {
    const inlineMessageDirectionsKeyboard = Markup.inlineKeyboard([
      Markup.callbackButton(`${STATIONS.MINSK} → ${STATIONS.NOVO}`,
          `${DIRECTION_KEY}_${DIRECTIONS.toNovogrudok}_${TRACK_KEY}`),
      Markup.callbackButton(`${STATIONS.NOVO} → ${STATIONS.MINSK}`,
          `${DIRECTION_KEY}_${DIRECTIONS.toMinsk}_${TRACK_KEY}`),
    ]).extra();

    ctx.reply(
        'Укажите направление',
        inlineMessageDirectionsKeyboard);
  }
});

bot.command(TRACK_DIFF_KEY, (ctx) => {
  if (isMessageUserAllowed(ctx)) {
    const inlineMessageDirectionsKeyboard = Markup.inlineKeyboard([
      Markup.callbackButton(`${STATIONS.MINSK} → ${STATIONS.NOVO}`,
          `${DIRECTION_KEY}_${DIRECTIONS.toNovogrudok}_${TRACK_DIFF_KEY}`),
      Markup.callbackButton(`${STATIONS.NOVO} → ${STATIONS.MINSK}`,
          `${DIRECTION_KEY}_${DIRECTIONS.toMinsk}_${TRACK_DIFF_KEY}`),
    ]).extra();

    ctx.reply(
        'Укажите направление',
        inlineMessageDirectionsKeyboard);
  }
});

bot.action(DIRECTION_REGEX, (ctx) => {
  let splittedAction = ctx.match.input.split('_');
  let selectedDirection = splittedAction[1];
  let selectedAction = splittedAction[2];

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
    dates.push(`${dayString}${dowLocaleString
        ? `, ${dowLocaleString}`
        : ''}`);
  }
  let buttons = dates.reduce((result, date) => {

    let button = Markup.callbackButton(date,
        `${DATE_KEY}_${date}_${selectedAction}`);

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

const sendTripsInfo = (ctx, isDiffSearch) => {
  getAllTrips(direction, date).then(trips => {
    let message = `${getDirectionString(direction, true)}\n`
        + `*Дата*: ${date}\n\n`;

    message += trips.length
        ? getMessageWithTrips(trips)
        : '_Мест не найдено_';

    if (isDiffSearch) {
      let isTripsEqual = isTripsResultEqual(lastTripsResult, trips);

      if (lastTripsResult === null || !isTripsEqual) {
        ctx.replyWithMarkdown(message);
      }
    }
    else {
      ctx.replyWithMarkdown(message);
    }

    lastTripsResult = trips;

  });
};

bot.action(/date_\d{2}.\d{2}.\d{4}.*/ig, (ctx) => {

  let splittedAction = ctx.match[0].split('_');
  let dateFull = splittedAction[1];
  let selectedAction = splittedAction[2];

  date = dateFull.split(',')[0];
  ctx.editMessageText(`Дата: ${dateFull}`);

  switch (selectedAction) {
    case TRACK_KEY:
      sendTripsInfo(ctx);

      timer = setInterval(() => {
        sendTripsInfo(ctx);
      }, ONE_MINUTE);
      break;
    case TRACK_DIFF_KEY:
      sendTripsInfo(ctx, true);

      timer = setInterval(() => {
        console.log('Go!', +(new Date()));
        sendTripsInfo(ctx, true);
      }, 1000 * 10);
      break;
  }
});

bot.command('stop', (ctx) => {
  if (isMessageUserAllowed(ctx)) {
    clearInterval(timer);
  }
});

module.exports = bot;