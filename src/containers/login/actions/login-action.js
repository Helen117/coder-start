import api from '../../../api';
import {UID_NOT_FOUND, FETCH_PROFILE, LOGIN, LOGOUT, COOKIES_LOGIN_STATE} from '../constants/login-action-types';


export function fetchProfile(uid) {
    if (uid === undefined) {
        return {type: UID_NOT_FOUND};
    }
    return {
        type: FETCH_PROFILE,
        payload: {
            promise: api.get('/user/' + uid)
        }
    }
}

export function login(user, password) {
    let path = '/login';
    return {
        type: LOGIN,
        payload: {
            promise: api.post(path, {
                data: {
                    username: user,
                    password: password
                }
            })
        }
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}

export function cookiesToReduxLoginState() {
    return {
        type: COOKIES_LOGIN_STATE
    }
}