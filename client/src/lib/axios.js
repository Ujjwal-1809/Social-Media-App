import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8001",
    withCredentials: true // this means we can send the cookies on every request sent by the client.
})