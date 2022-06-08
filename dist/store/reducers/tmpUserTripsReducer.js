"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../../js/commands");
const tmpUserTripsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_USER_TRACK':
            return Object.assign(Object.assign({}, state), { [action.payload.id]: { type: commands_1.TRACK_KEY } });
        case 'ADD_USER_TRACK_DIFF':
            return Object.assign(Object.assign({}, state), { [action.payload.id]: { type: commands_1.TRACK_DIFF_KEY } });
        case 'ADD_USER_DIRECTION':
            if (state[action.payload.id]) {
                let newUserData = Object.assign(Object.assign({}, state[action.payload.id]), { direction: action.payload.selectedDirection });
                return Object.assign(Object.assign({}, state), { [action.payload.id]: newUserData });
            }
            break;
        case 'ADD_USER_DATE':
            if (state[action.payload.id]) {
                let newUserData = Object.assign(Object.assign({}, state[action.payload.id]), { date: action.payload.selectedDate });
                return Object.assign(Object.assign({}, state), { [action.payload.id]: newUserData });
            }
            break;
        case 'REMOVE_USER':
            if (state[action.payload.id]) {
                return Object.keys(state).reduce((result, userId) => {
                    if (userId !== action.payload.id.toString()) {
                        result[userId] = state[userId];
                    }
                    return result;
                }, {});
            }
            break;
    }
    return state;
};
exports.default = tmpUserTripsReducer;
