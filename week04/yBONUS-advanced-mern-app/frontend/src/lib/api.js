import API from "../config/apiClient";


export const login = async (data) => 
    API.post("/auth/login", data);

export const register = async (data) => 
    API.post("/auth/register", data);

export const logout = async () => API.get("/auth/logout");

export const verifyEmail = async (verificationCode) => 
    API.get(`/auth/email/verify/${verificationCode}`);

export const forgotPassword = async (email) => 
    API.post('/auth/password/forgot', { email });

export const resetPassword = async (data) =>
    API.post('/auth/password/reset', data);

export const getUser = async () => API.get("/user");

export const getSessions = async () => API.get("/sessions");

export const deleteSession = async (id) => API.delete(`/sessions/${id}`);