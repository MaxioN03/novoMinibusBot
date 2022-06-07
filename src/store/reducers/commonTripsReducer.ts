const commonTripsReducer = (state: any = [], action: any) => {
    switch (action.type) {
        case 'ADD_COMMON_TRIPS':
            return [...state, action.payload.tripsInfo];
        case 'REMOVE_COMMON_TRIPS':
            //TODO remove by timer
            break;
    }
    return state;
}

export default commonTripsReducer;