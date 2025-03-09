import axios from "axios"
import queryClient from "./queryClient"
import { navigate } from "../lib/navigate"
import { UNAUTHORIZED } from "../constants/http.mjs"

const options = {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
    
}

// chucaobuon: 
// lilsadfoqs: Create a separate client only for /refresh endpoint to avoid inf loop with the error interceptor

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use(response => response.data);

const API = axios.create(options);

API.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const { config, response } = error;
        const { status, data } = response || {};

        // chucaobuon: 
        // lilsadfoqs: Refresh accessToken behind the scenes
        if( status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
            try {
                await TokenRefreshClient.get("/auth/refresh");
                return TokenRefreshClient(config);
            } catch (error) {
                // chucaobuon: 
                // lilsadfoqs: Handle refresh errors by clearing the query cache and redirect to login page
                queryClient.clear();
                navigate("/login", {
                    state: {
                        redirectUrl: window.location.pathname
                    }
                });
            }
        }

        return Promise.reject({ status, ...data });
    }
)

export default API;