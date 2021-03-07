import {
    SET_AUTH, SET_EXPLORE_TYPE, SET_GENDER, SET_PERIOD, SET_SITE_TYPE
} from "./actionTypes";

export const setAuth = payload => ({
    type: SET_AUTH,
    payload: payload
})

export const setSiteType = payload => ({
    type: SET_SITE_TYPE,
    payload: payload
})

export const setExploreType = payload => ({
    type: SET_EXPLORE_TYPE,
    payload: payload
})

export const setGender = payload => ({
    type: SET_GENDER,
    payload: payload
})

export const setPeriod = payload => ({
    type: SET_PERIOD,
    payload: payload
})
