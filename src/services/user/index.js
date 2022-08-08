import axios from 'axios';
import BE_URL from '../../config/env';

const userURL = `${BE_URL}/users`;

const createUser = async (name, email, password, role) => {
    try {
        const createUserRes = await axios({
            url: `${userURL}/create`,
            method: 'POST',
            data: {
                name,
                email,
                password,
                role
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return createUserRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const loginUser = async (email, password) => {
    console.lol('url: ', `${userURL}/login`);

    try {
        const loginUserRes = await axios({
            url: `${userURL}/login`,
            method: 'POST',
            data: {
                email,
                password
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return loginUserRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const fetchUser = async () => {
    try {
        const fetchUserRes = await axios({
            url: `${userURL}`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return fetchUserRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const logoutUser = async () => {
    try {
        const fetchUserRes = await axios({
            url: `${userURL}/logout`,
            method: 'POST',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return fetchUserRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

export { createUser, loginUser, fetchUser, logoutUser };
