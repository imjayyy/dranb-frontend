import {SET_SITE_TYPE} from "../actionTypes";

const initialState = {
    siteType: 1
}

const siteType = (state = initialState, action) => {
    switch (action.type) {
        case SET_SITE_TYPE: {
            const siteType = action.payload;
            return {
                ...state,
                siteType
            }
        }
        default:
            return state;
    }
}

export default siteType
