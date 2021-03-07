import {SET_FILTERS} from "../actionTypes";

const initialState = {
    filters: {
        isMine: true,
        gender: 0,
        period: -1
    }
}

const filters = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTERS: {
            const filters = action.payload;
            return {
                ...state,
                filters
            }
        }
        default:
            return state;
    }
}

export default filters
