import {TelegrafContext} from "telegraf/typings/context";
import {store} from "../../index";
import {Markup} from "telegraf";
import {getChatId, getDirectionString} from "../../js/utils";
import {DAY_OF_WEEK_SHORT_TRANSLATIONS, MAX_VISIBILITY_DAYS} from "../../js/constants";
import {DATE_KEY} from "../../js/commands";
const moment = require("moment");
import onUserTripsTimersUpdate from "../../js/onUserTripsTimersUpdate";

export const onDirectionHandler = async (ctx: TelegrafContext) => {
    let splittedAction = ctx?.match?.input.split('_');
    let selectedDirection = splittedAction?.[1];

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
    let buttons = dates.reduce((result: any, date) => {

        let button: any = Markup.callbackButton(date,
            `${DATE_KEY}_${date}`);

        if (result.length === 0) {
            result.push([button]);
        } else {
            if (result[result.length - 1].length === 2) {
                result.push([button]);
            } else {
                result[result.length - 1].push(button);
            }
        }

        return result;

    }, []);
    const inlineMessageDateKeyboard = Markup.inlineKeyboard(buttons).extra();

    let id = await getChatId(ctx);
    store.dispatch({type: 'ADD_USER_DIRECTION', payload: {id, selectedDirection}});

    ctx.editMessageText(getDirectionString(selectedDirection, false));

    ctx.reply(
        'Укажите дату',
        inlineMessageDateKeyboard);
};

export const onDateHandler = async (ctx: TelegrafContext) => {
    let splittedAction = ctx?.match?.[0].split('_');
    let dateFull = splittedAction?.[1];

    ctx.editMessageText(`Дата: ${dateFull}`);

    let id = await getChatId(ctx);

    store.dispatch({type: 'ADD_USER_DATE', payload: {id, selectedDate: dateFull?.split(',')[0]}});
    store.dispatch({type: 'ADD_USER_TIMER', payload: {id, tmpUserTrip: store.getState().TMPUserTripsRequestState[id]}});
    store.dispatch({type: 'REMOVE_USER', payload: {id}});

    onUserTripsTimersUpdate(id);
};