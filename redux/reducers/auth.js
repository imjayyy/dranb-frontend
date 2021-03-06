import {SET_AUTH} from "../actionTypes";

const initialState = {
    auth: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH: {
            const auth = action.payload;
            return {
                ...state,
                auth
            }
        }
        default:
            return state;
    }
}
