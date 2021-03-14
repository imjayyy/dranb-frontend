import axios from "axios";
import config from "../config";
import {prefixes} from "next/dist/build/output/log";

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

export const getHomeData = async (token, page, siteType, isAll, gender, period) => {
    const response = await axios.get(`${config.domain}/api/homepage-data?page=${page}&site_type=${siteType}&all=${isAll}&gender=${gender}&period=${period}`, {
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
        headers: {
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

export const toggleLoveProduct = async (token, productId) => {
    const response = await axios.post(`${config.domain}/api/toggle-love-product`, {
        id: productId
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getMyLoves = async (token, page) => {
    const response = await axios.get(`${config.domain}/api/my-loves?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const createBoard = async (token, payload) => {
    const response = await axios.post(`${config.domain}/api/boards`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBoards = async (token, page, productId) => {
    const response = await axios.get(`${config.domain}/api/boards?page=${page}&product_id=${productId}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleProductSaved = async (token, payload) => {
    const response = await axios.post(`${config.domain}/api/toggle-product-saved`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBoardsByCreator = async (token, username, page) => {
    const response = await axios.get(`${config.domain}/api/boards-by-creator/${username}?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getBoardInfo = async (token, boardName) => {
    const response = await axios.get(`${config.domain}/api/board/${boardName}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const toggleFollowBoard = async (token, boardName) => {
    const response = await axios.post(`${config.domain}/api/toggle-follow-board`, {
        name: boardName
    }, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getProductsByBoardName = async (token, name, page) => {
    const response = await axios.get(`${config.domain}/api/products-by-board-name/${name}?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const getMyFollowings = async (token, page) => {
    const response = await axios.get(`${config.domain}/api/my-followings?page=${page}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const deleteBoard = async (token, name) => {
    const response = await axios.delete(`${config.domain}/api/board/${name}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const changeBoardInfo = async (token, slug, payload) => {
    const response = await axios.post(`${config.domain}/api/board/${slug}`, payload, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    return response.data
}

export const uploadBoardImage = async (token, name, formData, onUploadProgress) => {
    const response = await axios.post(`${config.domain}/api/board/${name}/image`, formData, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onUploadProgress
    })
    return response.data
}

export const submitTicket = async (payload) => {
    const response = await axios.post(`${config.domain}/api/tickets`, payload)
    return response.data
}
