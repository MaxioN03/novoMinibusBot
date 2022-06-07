import {combineReducers} from "redux";
import tmpUserTripsReducer from "./tmpUserTripsReducer";
import userTripsRequestTimersReducer from "./userTripsRequestTimersReducer";
import commonTripsReducer from "./commonTripsReducer";
import botReducer from "./botReducer";

const rootReducer = combineReducers({
    bot: botReducer,
    TMPUserTripsRequestState: tmpUserTripsReducer,
    userTripsRequestTimersState: userTripsRequestTimersReducer,
    commonTripsState: commonTripsReducer,

});

export default rootReducer;