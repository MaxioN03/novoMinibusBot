const botReducer = (state = null, action: any) => {
    switch (action.type) {
        case 'ADD_CREATED_BOT':
            return action.payload;
        default:
            return state;
    }
};

export default botReducer;