"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userTripsRequestTimersReducer = (state = {}, action) => {
    var _a;
    switch (action.type) {
        case 'ADD_USER_TIMER':
            //TODO start timer searching
            let tmpUserTrip = (_a = action.payload.tmpUserTrip) !== null && _a !== void 0 ? _a : null;
            if (state[action.payload.id] && tmpUserTrip) {
                return Object.assign(Object.assign({}, state), { [action.payload.id]: [...state[action.payload.id], tmpUserTrip] });
            }
            else {
                return Object.assign(Object.assign({}, state), { [action.payload.id]: { timer: null, trips: [tmpUserTrip] } });
            }
        case 'REMOVE_USER_TIMERS':
            if (state[action.payload.id]) {
                return Object.keys(state).reduce((result, userId) => {
                    if (userId !== action.payload.id.toString()) {
                        result[userId] = state[userId];
                    }
                    else {
                        clearTimeout(state[userId].timer);
                    }
                    return result;
                }, {});
            }
    }
    return state;
};
exports.default = userTripsRequestTimersReducer;
