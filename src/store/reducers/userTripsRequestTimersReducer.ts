const userTripsRequestTimersReducer = (state: any = {}, action: any) => {
    switch (action.type) {
        case 'ADD_USER_TIMER':
            //TODO start timer searching
            let tmpUserTrip = action.payload.tmpUserTrip ?? null;
            if (state[action.payload.id] && tmpUserTrip) {
                return {...state, [action.payload.id]: [...state[action.payload.id], tmpUserTrip]};
            } else {
                return {...state, [action.payload.id]: {timer: null, trips: [tmpUserTrip]}};
            }
        case 'REMOVE_USER_TIMERS':
            if (state[action.payload.id]) {
                return Object.keys(state).reduce((result: any, userId: string) => {
                    if (userId !== action.payload.id.toString()) {
                        result[userId] = state[userId];
                    } else {
                        clearTimeout(state[userId].timer);
                    }
                    return result;
                }, {});
            }
    }
    return state;
}

export default userTripsRequestTimersReducer