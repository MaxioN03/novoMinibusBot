import {TelegrafContext} from "telegraf/typings/context";
import {store} from "../../index";
import {Markup} from "telegraf";
import {getChatId} from "../../js/utils";
import {DIRECTIONS, STATIONS} from "../../js/constants";
import {DIRECTION_KEY} from "../../js/commands";

export const onTrackHandler = async (ctx: TelegrafContext) => {
    const inlineMessageDirectionsKeyboard = Markup.inlineKeyboard([
        Markup.callbackButton(`${STATIONS.MINSK} → ${STATIONS.NOVO}`,
            `${DIRECTION_KEY}_${DIRECTIONS.toNovogrudok}`),
        Markup.callbackButton(`${STATIONS.NOVO} → ${STATIONS.MINSK}`,
            `${DIRECTION_KEY}_${DIRECTIONS.toMinsk}`),
    ]).extra();

    let id = await getChatId(ctx);

    store.dispatch({type: 'ADD_USER_TRACK', payload: {id}});

    ctx.reply(
        'Укажите направление',
        inlineMessageDirectionsKeyboard);
};

export const onTrackDiffHandler = async (ctx: TelegrafContext) => {
    const inlineMessageDirectionsKeyboard = Markup.inlineKeyboard([
        Markup.callbackButton(`${STATIONS.MINSK} → ${STATIONS.NOVO}`,
            `${DIRECTION_KEY}_${DIRECTIONS.toNovogrudok}`),
        Markup.callbackButton(`${STATIONS.NOVO} → ${STATIONS.MINSK}`,
            `${DIRECTION_KEY}_${DIRECTIONS.toMinsk}`),
    ]).extra();

    let id = await getChatId(ctx);
    store.dispatch({type: 'ADD_USER_TRACK_DIFF', payload: {id}});

    ctx.reply(
        'Укажите направление',
        inlineMessageDirectionsKeyboard);
};

export const onStopHandler = async (ctx: TelegrafContext) => {
    let id = await getChatId(ctx);
    store.dispatch({type: 'REMOVE_USER_TIMERS', payload: {id}});
};
