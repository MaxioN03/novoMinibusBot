"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const tmpUserTripsReducer_1 = __importDefault(require("./tmpUserTripsReducer"));
const userTripsRequestTimersReducer_1 = __importDefault(require("./userTripsRequestTimersReducer"));
const commonTripsReducer_1 = __importDefault(require("./commonTripsReducer"));
const botReducer_1 = __importDefault(require("./botReducer"));
const rootReducer = (0, redux_1.combineReducers)({
    bot: botReducer_1.default,
    TMPUserTripsRequestState: tmpUserTripsReducer_1.default,
    userTripsRequestTimersState: userTripsRequestTimersReducer_1.default,
    commonTripsState: commonTripsReducer_1.default,
});
exports.default = rootReducer;
