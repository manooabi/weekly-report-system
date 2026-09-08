const TOKEN_KEY = 'weekly_report_token';
const USER_KEY = 'weekly_report_user';

const saveAuth = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const getUser = () => {
    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
};

const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export {
    saveAuth,
    getToken,
    getUser,
    clearAuth
};