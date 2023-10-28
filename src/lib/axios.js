import axios from "axios";


export const unplashApiClient = axios.create({
    baseURL: import.meta.env.VITE_UNSPLASH_BASEURL,
    headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
    }
})