import axios from "axios";


const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

apiInstance.interceptors.request.use(function (config) {
    if (localStorage.getItem("token") != null) {
        config.headers['Authorization'] = `Token ${localStorage.getItem('token')}`   
    }
    return config;
},function (error) {
    return Promise.reject(error);
});

apiInstance.interceptors.response.use((response)=>{return response}, (error)=>{
    if (error.status === 401){
        localStorage.removeItem('token')
        window.location.href = '/'
    }
    return Promise.reject(error)
})

export default apiInstance;