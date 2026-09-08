import api from './api';
import { saveAuth } from './auth.storage';


const register = async (userData) => {
    const response = await api.post('/auth/register', userData);

    return response.data;
};

const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data.data;

    saveAuth(token, user);
    
    return response.data;
};

export default {
    register,
    login
};