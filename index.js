const {Telegraf} = require('telegraf');
const {Markup} = Telegraf;
const moment = require('moment');
const {getAllTrips} = require('./js/tripsFetcher');
const {DIRECTIONS, STATIONS, ONE_MINUTE, MAX_VISIBILITY_DAYS} = require('./js/constants');
const {getMessageWithTrips, isMessageUserAllowed, getDirectionString} = require('./js/utils');
const {TRACK_KEY, DIRECTION_KEY, DIRECTION_REGEX, DATE_KEY} = require('./js/commands');

const bot = new Telegraf(process.env.BOT_TOKEN || TOKEN);

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
    dates.push(moment().add(i, 'days').format('DD-MM-YYYY'));
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

bot.launch();

// const {Composer} = require('micro-bot');
// const bot = new Composer();
// const COMMON_CHANNEL_LINK = 'https://t.me/novapohliad';
//
// bot.start((ctx) => ctx.reply(`Здравствуйте! Пришлите ваше сообщение.\n\n`
//     + `Для того, чтобы узнать подробнее о боте, введите команду /help\n\n`
//     + `Бот анонимный, это значит, что мы не можем ответить на присланное вами сообщение, потому что его автор нам неизвестен\n\n`
//     + `Основной канал: ${COMMON_CHANNEL_LINK}`));
// bot.help((ctx) => ctx.reply(`Данный бот принимает ваши сообщения для редакции.\n\n`
//     + `Если у вас есть новости, фото, предложения или что-то ещё, прислыайте их сюда\n\n`
//     + `Бот анонимный, это значит, что мы не можем ответить на присланное вами сообщение, потому что его автор нам неизвестен\n\n`
//     + `Основной канал: ${COMMON_CHANNEL_LINK}`));
//
// bot.start((ctx) => ctx.reply(`Здравствуйте! Пришлите ваше сообщение.\n\n`))
//
// bot.on([
//     'message',
//     'edited_message',
//     'channel_post',
//     'edited_channel_post',
//     'inline_query',
//     'shipping_query',
//     'pre_checkout_query',
//     'chosen_inline_result'], async (ctx, next) => {
//
//     ctx.telegram.sendMessage(process.env.GROUP_ID, `Сообщение от подписчика:`)
//         .then(() => {
//             ctx.telegram.sendCopy(process.env.GROUP_ID, ctx.update.message)
//                 .then(() => {
//                     ctx.reply('Спасибо, ваше сообщение принято!');
//                 })
//                 .catch(error => {
//                     ctx.reply('Произошла ошибка, попробуйте ещё раз');
//                     console.log('Error: \n\n', error, '\n\nContext: \n\n', ctx);
//                     ctx.telegram.sendMessage(process.env.GROUP_ID, `❗️❗️❗️У пользователя возникла ошибка, смотреть в логах`)
//                 })
//         });
//
//     await next();
// });
//
// module.exports = bot;
