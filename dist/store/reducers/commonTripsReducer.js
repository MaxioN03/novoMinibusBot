"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonTripsReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_COMMON_TRIPS':
            return [...state, action.payload.tripsInfo];
        case 'REMOVE_COMMON_TRIPS':
            //TODO remove by timer
            break;
    }
    return state;
};
exports.default = commonTripsReducer;
