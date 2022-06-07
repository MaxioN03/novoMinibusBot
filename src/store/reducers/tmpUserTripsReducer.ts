import {TRACK_DIFF_KEY, TRACK_KEY} from "../../js/commands";

const tmpUserTripsReducer = (state: any = {}, action: any) => {
    switch (action.type) {
        case 'ADD_USER_TRACK':
            return {...state, [action.payload.id]: {type: TRACK_KEY}};
        case 'ADD_USER_TRACK_DIFF':
            return {...state, [action.payload.id]: {type: TRACK_DIFF_KEY}};
        case 'ADD_USER_DIRECTION':
            if (state[action.payload.id]) {
                let newUserData = {...state[action.payload.id], direction: action.payload.selectedDirection};
                return {...state, [action.payload.id]: newUserData};
            }
            break;
        case 'ADD_USER_DATE':
            if (state[action.payload.id]) {
                let newUserData = {...state[action.payload.id], date: action.payload.selectedDate};
                return {...state, [action.payload.id]: newUserData};
            }
            break;
        case 'REMOVE_USER':
            if (state[action.payload.id]) {
                return Object.keys(state).reduce((result: any, userId: string) => {
                    if (userId !== action.payload.id.toString()) {
                        result[userId] = state[userId];
                    }
                    return result;
                }, {});
            }
            break;
    }
    return state;
}

export default tmpUserTripsReducer;