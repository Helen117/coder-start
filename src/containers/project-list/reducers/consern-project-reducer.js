/**
 * Created by Administrator on 2016-09-26.
 */
import {
    CONSERN_PROJECT_PENDING,
    CONSERN_PROJECT_SUCCESS,
    CONSERN_PROJECT_ERROR,

    UNCONSERN_PROJECT_PENDING,
    UNCONSERN_PROJECT_SUCCESS,
    UNCONSERN_PROJECT_ERROR
} from '../constants/consern-action-types';

const initialState = {
    fetchStatus:false,
    statusErrors:null
};

export function consernProject(state = initialState, action = {}) {
    switch (action.type) {
        case CONSERN_PROJECT_PENDING:
            return Object.assign({}, initialState, {fetchStatus: false});
        case CONSERN_PROJECT_SUCCESS:
            return Object.assign({}, initialState, {fetchStatus:true, consernedInfo:action.payload});
        case CONSERN_PROJECT_ERROR:
            return {
                ...state,
                fetchStatus: false,
                statusErrors: action.payload.errorMsg
            };
        default:
            return state;
    }
}

export function unconsernProject(state = initialState, action = {}) {
    switch (action.type) {
        case UNCONSERN_PROJECT_PENDING:
            return Object.assign({}, initialState, {fetchStatus: false});
        case UNCONSERN_PROJECT_SUCCESS:
            return Object.assign({}, initialState, {fetchStatus:true, unconsernedInfo:action.payload});
        case UNCONSERN_PROJECT_ERROR:
            return {
                ...state,
                fetchStatus: false,
                statusErrors: action.payload.errorMsg
            };
        default:
            return state;
    }
}