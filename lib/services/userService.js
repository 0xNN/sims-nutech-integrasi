import axios from 'axios';
import { API_URL } from '../config/contants';
import { resetAuthAsyncStorage, setAuthAsyncStorage } from "./getAuthAsyncStorage";

function login(username, password) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}login`, {
            email: username,
            password,
        }).then(async (response) => {
            try {
                const { data } = response;
                const auth = {
                    token: data.data.token,
                    user: username,
                }
                await setAuthAsyncStorage(auth);
                resolve(data);
            } catch (e) { reject(e) }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function registrasi(data) {
    const { email, first_name, last_name, password } = data;
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}registration`, {
            email,
            first_name,
            last_name,
            password,
        }).then(async (response) => {
            try {
                const { message } = response.data;
                resolve(message);
            } catch (e) { reject(e) }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function profile(token) {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}profile`,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                const { data } = response;
                resolve(data);
            } catch (e) {
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function balance(token) {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}balance`,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                const { data } = response;
                resolve(data);
            } catch (e) { 
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function services(token) {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}services`,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                const { data } = response;
                resolve(data);
            } catch (e) { 
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function banner(token) {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}banner`,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                const { data } = response;
                resolve(data);
            } catch (e) {
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function topup(token, data) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}topup`,data,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                resolve(response);
            } catch (e) {
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function transaction(token, data) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}transaction`,data,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                resolve(response);
            } catch (e) {
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function transactionHistory(token, offset = 0, limit = 5) {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}transaction/history?offset=${offset}&limit=${limit}`,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                const { data } = response;
                resolve(data);
            } catch (e) {
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function profileUpdate(token, data) {
    return new Promise((resolve, reject) => {
        axios.put(`${API_URL}profile/update`,data,{
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            try {
                const { data } = response;
                resolve(data);
            } catch (e) {
                reject(e) 
            }
        }).catch((err) => {
            reject(err)
        });
    });
}

async function profileImageUpdate(token, data) {
    return new Promise((resolve, reject) => {
        console.log(`${API_URL}profile/image`);
        axios.put(`${API_URL}profile/image`,data,{
            headers: {
                authorization: `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(async (response) => {
            try {
                console.log(response);
                const { data } = response;
                resolve(data);
            } catch (e) { 
                console.log(e);
                reject(e) 
            }
        }).catch((err) => {
            console.log(err);
            reject(err)
        });
    });
}

async function logout(getState) {
    return new Promise(async (resolve, reject) => {
        const currentState = getState();
        const { token } = currentState.auth;
        resolve(token);
        await resetAuthAsyncStorage();
        // axios.get(`${API_URL}/logout`, {
        //     headers: {
        //         authorization: `Bearer ${token}`,
        //     },
        // }).then(async (response) => {
        // }).catch(async (err) => {
        //     await resetAuthAsyncStorage();
        //     reject(err)
        // });
    });
}

export const userService = {
    login,
    registrasi,
    profile,
    balance,
    services,
    banner,
    topup,
    transaction,
    transactionHistory,
    profileUpdate,
    profileImageUpdate,
    logout,
};