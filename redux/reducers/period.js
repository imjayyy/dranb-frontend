import {SET_PERIOD} from "../actionTypes";

const initialState = {
    period: -1
}

const period = (state = initialState, action) => {
    switch (action.type) {
        case SET_PERIOD: {
            const period = action.payload;
            return {
                ...state,
                period
            }
        }
        default:
            return state;
    }
}

export default period
