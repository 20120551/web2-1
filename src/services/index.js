import { unplashApiClient } from "../lib/axios";

export const getPhotos = async ({ page, perPage }) => {
    console.log(`make request to endpoint /photos?per_page=${perPage}&page=${page}`)
    const res = await unplashApiClient.get(`/photos?per_page=${perPage}&page=${page}`);
    return res.data;
}

export const searchPhotos = async ({ query, page, perPage }) => {
    console.log(`/search/photos?query=${query}&page=${page}&per_page=${perPage}`)
    const res = await unplashApiClient.get(`/search/photos?query=${query}&page=${page}&per_page=${perPage}`);
    return res.data;
}