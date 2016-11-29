/**
 * Created by zhaojp on 2016/11/28.
 */
import { GET_PROJECT_INFO_PENDING ,
    GET_PROJECT_INFO_SUCCESS ,
    GET_PROJECT_INFO_ERROR,

    DEVELOP_CONFIRM_PENDING ,
    DEVELOP_CONFIRM_SUCCESS ,
    DEVELOP_CONFIRM_ERROR
} from '../constants/to-be-confirmed-action-types';

const initialState = {
};

export function getMyProjectInfo(state = initialState, action = {}) {

    switch (action.type) {

        case GET_PROJECT_INFO_PENDING:
            return Object.assign({}, initialState, {loading: true, items:[], errMessage:null});

        case GET_PROJECT_INFO_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload, loading: false, errMessage:null});

        case GET_PROJECT_INFO_ERROR:
            return {state, errMessage: action.payload.errorMsg, loading: false,};

        default:
            return state;
    }
}

export function developConfirm(state = initialState, action = {}) {

    switch (action.type) {

        case DEVELOP_CONFIRM_PENDING:
            return Object.assign({}, initialState, {loading: true, result:[], errMessage:null});

        case DEVELOP_CONFIRM_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload, loading: false, errMessage:null});

        case DEVELOP_CONFIRM_ERROR:
            return {state, errMessage: action.payload.errorMsg, loading: false,};

        default:
            return state;
    }
}