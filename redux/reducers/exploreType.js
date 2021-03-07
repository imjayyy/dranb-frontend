import {SET_EXPLORE_TYPE} from "../actionTypes";


const initialState = {
    exploreType: false // false: all, true: my selection
}

const exploreType = (state = initialState, action) => {
    switch (action.type) {
        case SET_EXPLORE_TYPE: {
            const exploreType = action.payload;
            return {
                ...state,
                exploreType
            }
        }
        default:
            return state;
    }
}

export default exploreType
