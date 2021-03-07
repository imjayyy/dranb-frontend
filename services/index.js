import axios from "axios";
import config from "../config";

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

export const getUser = async (token) => {
    const response = await axios.get(`${config.domain}/api/me`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        }
    })
    return response.data
}

export const registerUser = async (payload) => {
    return await axios.post(`${config.domain}/api/users`, payload)
}

export const loginUser = async (payload) => {
    return await axios.post(`${config.domain}/api/sessions`, payload)
}

export const getHomeData = async (token, page, siteType, isAll) => {
    const response = await axios.get(`${config.domain}/api/homepage-data?page=${page}&site_type=${siteType}&all=${isAll}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getSites = async () => {
    const response = await axios.get(`${config.domain}/api/sites`)
    return response.data
}

export const getMyProfile = async (token) => {
    const response = await axios.get(`${config.domain}/api/my-profiles`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleUsersSites = async (payload, token) => {
    const response = await axios.post(`${config.domain}/api/toggle-users-sites`, payload, {
        headers: {
            "Authorization": `Token ${token}`
        }
    })
    return response.data
}

export const patchProfile = async (payload, token) => {
    const response = await axios.patch(`${config.domain}/api/update-profile`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getProductsByBrand = async (brandName, page, siteType, token) => {
    const response = await axios.get(`${config.domain}/api/by-brand-name/${brandName}?page=${page}&site_type=${siteType}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}
