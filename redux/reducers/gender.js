import {SET_GENDER} from "../actionTypes";

const initialState = {
    gender: 0
}

const gender = (state = initialState, action) => {
    switch (action.type) {
        case SET_GENDER: {
            const gender = action.payload;
            return {
                ...state,
                gender
            }
        }
        default:
            return state;
    }
}

export default gender
