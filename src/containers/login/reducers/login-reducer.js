import {
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
    COOKIES_LOGIN_STATE,
    FETCH_PROFILE_PENDING,
    FETCH_PROFILE_SUCCESS,
    UID_NOT_FOUND
} from '../constants/login-action-types';

//import authUtils from '../../../utils/auth';
import * as Cookies from "js-cookie";

const initialState = {
    uid: null,
    profile: null,
    loggingIn: false,
    loggingOut: false,
    loginErrors: null
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN_PENDING:
            return Object.assign({}, initialState, {loggingIn: true});
        case LOGIN_SUCCESS:
            //authUtils.login(action.payload.token, action.payload.userId);
            return Object.assign({}, initialState, {profile:action.payload,uid: action.payload.userId, loggingIn: false, loginErrors: null});
        case LOGIN_ERROR:
            return {
                ...state,
                loggingIn: false,
                uid: null,
                loginErrors: action.payload.errorMsg
            };
        case LOGOUT:
            Cookies.remove('uid');
            Cookies.remove('profile');
            //authUtils.logout();
            location.replace('/login');
            return {
                ...state,
                loggingOut: false,
                uid: null,
                loginErrors: null
            };
        case COOKIES_LOGIN_STATE:
            const uid = parseInt(Cookies.get('uid'));
            const profile = Cookies.getJSON('profile');
            return Object.assign({}, initialState, {profile:profile,uid: uid, loggingIn: false, loginErrors: null});
        case FETCH_PROFILE_SUCCESS:
            return Object.assign({}, initialState, {profile: action.payload, uid: state.uid});
        case UID_NOT_FOUND:
            return state;
        default:
            return state;
    }
}
