import axios, {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8000/api",
});

// Request interceptor
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const tokenData = localStorage.getItem("ACCESS_TOKEN");
        // console.log(tokenData);
        // const { token, expiry } = JSON.parse(tokenData ? tokenData : "");

        if (tokenData && config.headers) {
            const { token, expiry } = JSON.parse(tokenData ? tokenData : "");
            console.log(token);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
                // window.location.reload(); // Uncomment if you want to reload the page on 401
            } else if (response.status === 404) {
                // Show not found
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
