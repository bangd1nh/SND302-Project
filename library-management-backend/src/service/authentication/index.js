export const login = (username, password) => {
    const mockUser = {
        username: "admin",
        password: "password",
    };

    if (username === mockUser.username && password === mockUser.password) {
        return {
            success: true,
            message: "Login successful",
            token: "mockToken123",
        };
    } else {
        return {
            success: false,
            message: "Invalid username or password",
        };
    }
};
