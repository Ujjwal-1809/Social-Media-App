import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://social-media-app-sw7v.onrender.com",
    withCredentials: true // this means we can send the cookies on every request sent by the client.
})