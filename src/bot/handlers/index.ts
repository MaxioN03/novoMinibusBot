import {DATE_REGEX, DIRECTION_REGEX, STOP, TRACK_DIFF_KEY, TRACK_KEY} from "../../js/commands";
import {onStopHandler, onTrackDiffHandler, onTrackHandler} from "./commandsHandlers";
import {onDateHandler, onDirectionHandler} from "./actionsHandlers";
import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";

const COMMANDS_HANDLERS = [
    {key: TRACK_KEY, handler: onTrackHandler},
    {key: TRACK_DIFF_KEY, handler: onTrackDiffHandler},
    {key: STOP, handler: onStopHandler},
];

const ACTIONS_HANDLERS = [
    {key: DIRECTION_REGEX, handler: onDirectionHandler},
    {key: DATE_REGEX, handler: onDateHandler},
];

const applyBotHandlers = (bot: Telegraf<TelegrafContext>) => {
    COMMANDS_HANDLERS.forEach(({key, handler}) => {
        bot.command(key, handler);
    });
    ACTIONS_HANDLERS.forEach(({key, handler}) => {
        bot.action(key, handler);
    });
};

export default applyBotHandlers;