/**
 * Created by Administrator on 2016-11-07.
 */
import {
    GET_USER_INFO_PENDING,
    GET_USER_INFO_SUCCESS,
    GET_USER_INFO_ERROR,
    GET_ALL_USER_INFO_PENDING,
    GET_ALL_USER_INFO_SUCCESS,
    GET_ALL_USER_INFO_ERROR
} from '../constants/user-info-types';

const initialState = {
    userInfoData:[],
    allUserInfo:[]
};

export default function getUserInfo(state = initialState, action = {}) {
    switch (action.type) {
        case GET_USER_INFO_PENDING:
            return Object.assign({}, initialState, {loading: true});
        case GET_USER_INFO_SUCCESS:
            return Object.assign({}, initialState, {loading: false, userInfoData: action.payload});
        case GET_USER_INFO_ERROR:
            return {
                ...state,
                errors: action.payload.message, loading: false
            };
        case GET_ALL_USER_INFO_PENDING:
            return Object.assign({}, initialState, {allUserloading: true});
        case GET_ALL_USER_INFO_SUCCESS:
            return Object.assign({}, initialState, {allUserloading: false, allUserInfo: action.payload});
        case GET_ALL_USER_INFO_ERROR:
            return {
                ...state,
                errors: action.payload.message, allUserloading: false
            };
        default:
            return state;
    }
}