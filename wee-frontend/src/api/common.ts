import axios from "axios";

const apiServer = import.meta.env.VITE_API_URL;

console.log('apiServer env:', apiServer);

export const CommonAPI = axios.create({
    baseURL: apiServer,
});