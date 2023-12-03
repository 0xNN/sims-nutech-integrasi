import {
    AUTH_ERR_LOG_IN,
    AUTH_ERR_LOG_OUT,
    AUTH_LOGGED_IN,
    AUTH_LOGGING_IN,
    AUTH_LOGGING_OUT,
    AUTH_LOGOUT,
    AUTH_ERR_MESSAGE,
    AUTH_REGISTRASI_SUCCESS,
    AUTH_BALANCE,
    AUTH_IMAGE_PROFILE,
} from "../constants/auth";
import { navigate } from "../services/navRef";
import { userService } from "../services/userService";

export const loggingIn = (loggingIn) => ({
    type: AUTH_LOGGING_IN,
    payload: loggingIn
});

export const loggedIn = (data) => ({
    type: AUTH_LOGGED_IN,
    payload: data,
});

export const registrasiSuccess = (data) => ({
    type: AUTH_REGISTRASI_SUCCESS,
    payload: data,
});

export const errorLogIn = (errorMessage) => ({
    type: AUTH_ERR_LOG_IN,
    payload: errorMessage,
});

export const errorMessage = (errorMessage) => ({
    type: AUTH_ERR_MESSAGE,
    payload: errorMessage,
});

export const changeBalance = (balance) => ({
    type: AUTH_BALANCE,
    payload: balance,
});

export const changeImageProfile = (image) => ({
    type: AUTH_IMAGE_PROFILE,
    payload: image,
});

export const login = (username, password) => (dispatch) => {
    dispatch(loggingIn(true));
    userService.login(username, password).then(async (res) => {
        const auth = {
            token: res.data.token,
            user: username,
        }
        await dispatch(loggedIn(auth));
        navigate('Home');
    }).catch((err) => {
        if (!err.response) {
            dispatch(errorLogIn('Network Error'));
            return;
        }
        const { message } = err.response.data;
        const { status } = err.response;
        dispatch(errorLogIn(message));
    }).finally(() => {
        dispatch(loggingIn(false));
    });
};

export const registrasi = (data) => (dispatch) => {
    dispatch(loggingIn(true));
    userService.registrasi(data).then(async (res) => {
        await dispatch(registrasiSuccess(res));
        await dispatch(errorMessage(null));
    }).catch((err) => {
        if (!err.response) {
            dispatch(errorMessage('Network Error'));
            dispatch(registrasiSuccess(null));
            return;
        }
        const { message } = err.response.data;
        dispatch(errorMessage(message));
        dispatch(registrasiSuccess(null));
    }).finally(() => {
        dispatch(loggingIn(false));
    });
};

export const loggedOut = () => ({
    type: AUTH_LOGOUT,
});

export const loggingOut = (lOut) => ({
    type: AUTH_LOGGING_OUT,
    payload: lOut,
});

export const errorLogOut = (errorMessage) => ({
    type: AUTH_ERR_LOG_OUT,
    payload: errorMessage,
});

export const logout = () => async (dispatch, getState) => {
    dispatch(changeImageProfile(null));
    dispatch(loggingOut(true));
    await userService.logout(getState).then((res) => {
        dispatch(loggedOut());
    }).catch((err) => {
        dispatch(errorLogOut('Error logging out.'));
    }).finally(() => {
        dispatch(loggingOut(false));
    });
};