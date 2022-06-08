"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../../js/commands");
const commandsHandlers_1 = require("./commandsHandlers");
const actionsHandlers_1 = require("./actionsHandlers");
const COMMANDS_HANDLERS = [
    { key: commands_1.TRACK_KEY, handler: commandsHandlers_1.onTrackHandler },
    { key: commands_1.TRACK_DIFF_KEY, handler: commandsHandlers_1.onTrackDiffHandler },
    { key: commands_1.STOP, handler: commandsHandlers_1.onStopHandler },
];
const ACTIONS_HANDLERS = [
    { key: commands_1.DIRECTION_REGEX, handler: actionsHandlers_1.onDirectionHandler },
    { key: commands_1.DATE_REGEX, handler: actionsHandlers_1.onDateHandler },
];
const applyBotHandlers = (bot) => {
    COMMANDS_HANDLERS.forEach(({ key, handler }) => {
        bot.command(key, handler);
    });
    ACTIONS_HANDLERS.forEach(({ key, handler }) => {
        bot.action(key, handler);
    });
};
exports.default = applyBotHandlers;
