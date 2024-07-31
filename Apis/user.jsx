import React from "react";
import axios from 'axios'
const backendUrl = 'https://backend-project-6141.onrender.com/user'

export const loginUser = async ({ Username, Password }) => {
    try {
        const reqUrl = `${backendUrl}/login`;
        const response = await axios.post(reqUrl, { Username, Password })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const registerUser = async ({ Username, Password }) => {
    try {
        const reqUrl = `${backendUrl}/register`;
        const response = await axios.post(reqUrl, { Username, Password })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getUserDetails = async (Username) => {
    try {
        const reqUrl = `${backendUrl}/details`;
        const response = await axios.post(reqUrl, { Username })
        return response.data
    } catch (error) {
        console.log(error)
    }
}
