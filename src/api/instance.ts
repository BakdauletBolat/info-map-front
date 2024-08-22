import axios from "axios";


const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

apiInstance.interceptors.request.use(function (config) {
    config.headers['Authorization'] = 'Token 0ee31e23f473bbbcdf5ab2be4dfa7cdff866083c'
    return config;
},function (error) {
    return Promise.reject(error);
});

export default apiInstance;