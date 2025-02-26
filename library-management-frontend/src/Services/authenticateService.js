import axios from "axios";

const AUTH_REST_API_BASE_URL = "http://localhost:3000/api/authenticate";

export const loginAPICALL = (usernameOrEmail, password) =>
    axios.post(AUTH_REST_API_BASE_URL + "/login", {
        usernameOrEmail: usernameOrEmail,
        password: password,
    });

export const storeToken = (token) => {
    localStorage.setItem("token", token);
};

export const saveLoggedInUser = (user) => {
    sessionStorage.setItem("authenticatedUser", user.email);
    sessionStorage.setItem("userId", user.userId);
    sessionStorage.setItem("verify", user.verify);
    sessionStorage.setItem("role", user.role);
};

export const isUserLoggedIn = () => {
    const username = sessionStorage.getItem("authenticatedUser");
    if (username == null) {
        return false;
    } else {
        return true;
    }
};

export const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
};

export const register = (newUser) =>
    axios.post(AUTH_REST_API_BASE_URL + "/register", newUser);

export const resetPassword = (email) =>
    axios.post(AUTH_REST_API_BASE_URL + "/forgotPassword", { email: email });

export const getEmailByToken = (token) =>
    axios.get(AUTH_REST_API_BASE_URL + "/getEmail/" + token);

export const checkResetToken = (token) =>
    axios.get(AUTH_REST_API_BASE_URL + "/checkResetToken/" + token);

export const forgotPassword = (token, body) =>
    axios.post(AUTH_REST_API_BASE_URL + "/forgotPassword/" + token, body);
