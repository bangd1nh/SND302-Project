import axios from "axios";

const USER_REST_API_BASE_URL = "http://localhost:3000/api/user";

export const getUserById = (userId) =>
    axios.get(USER_REST_API_BASE_URL + "/" + userId);

export const getUserId = () => {
    return sessionStorage.getItem("userId");
};

export const updateUser = (userId, userProfile) =>
    axios.put(USER_REST_API_BASE_URL + "/" + userId, userProfile);

export const updateUserImage = (formData, id) =>
    axios.post(USER_REST_API_BASE_URL + "/uploadToCloudinary/" + id, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getAllUser = () => axios.get(USER_REST_API_BASE_URL);

export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await axios.post(
            `${USER_REST_API_BASE_URL}/change-password/${userId}`,
            { oldPassword, newPassword }
        );
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error.response?.data || error);
        throw error.response?.data || error;
    }
};

