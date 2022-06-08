"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botReducer = (state = null, action) => {
    switch (action.type) {
        case 'ADD_CREATED_BOT':
            return action.payload;
        default:
            return state;
    }
};
exports.default = botReducer;
