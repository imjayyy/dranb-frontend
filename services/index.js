import axios from "axios";
import config from "../config";

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

export const getHomeData = async (token, page, siteType, isAll, gender) => {
    const response = await axios.get(`${config.domain}/api/homepage-data?page=${page}&site_type=${siteType}&all=${isAll}&gender=${gender}`, {
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

export const toggleUsersSites = async (token, payload) => {
    const response = await axios.post(`${config.domain}/api/toggle-users-sites`, payload, {
        headers: {
            "Authorization": `Token ${token}`
        }
    })
    return response.data
}

export const patchProfile = async (token, payload) => {
    const response = await axios.patch(`${config.domain}/api/update-profile`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getProductsByBrand = async (token, brandName, page, siteType, gender, period) => {
    const response = await axios.get(`${config.domain}/api/by-brand-name/${brandName}?site_type=${siteType}&gender=${gender}&period=${period}&page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleFollowBrand = async (token, brandName) => {
    const response = await axios.post(`${config.domain}/api/toggle-follow-brand`, {
        name: brandName
    }, {
        headers:  {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBrandInfo = async (token, brandName) => {
    const response = await axios.get(`${config.domain}/api/brand/${brandName}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}
