import {
    SET_AUTH, SET_FILTERS, SET_SITE_TYPE
} from "./actionTypes";

export const setAuth = payload => ({
    type: SET_AUTH,
    payload: payload
})

export const setSiteType = payload => ({
    type: SET_SITE_TYPE,
    payload: payload
})

export const setFilters = payload => ({
    type: SET_FILTERS,
    payload: payload
})
