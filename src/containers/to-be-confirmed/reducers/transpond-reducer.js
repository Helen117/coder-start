/**
 * Created by zhaojp on 2016/11/28.
 */
import { GET_TRANSPOND_MEMBER_PENDING ,
    GET_TRANSPOND_MEMBER_SUCCESS ,
    GET_TRANSPOND_MEMBER_ERROR,

    DEVELOP_TRANSPOND_PENDING ,
    DEVELOP_TRANSPOND_SUCCESS ,
    DEVELOP_TRANSPOND_ERROR,
    
} from '../constants/to-be-confirmed-action-types';

const initialState = {
};

export function getTranspondMember(state = initialState, action = {}) {

    switch (action.type) {

        case GET_TRANSPOND_MEMBER_PENDING:
            return Object.assign({}, initialState, {loading: true, items:[], errMessage:null});

        case GET_TRANSPOND_MEMBER_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload, loading: false, errMessage:null});

        case GET_TRANSPOND_MEMBER_ERROR:
            return {state, errMessage: action.payload.errorMsg, loading: false,};

        default:
            return state;
    }
}

export function developTranspond(state = initialState, action = {}) {

    switch (action.type) {

        case DEVELOP_TRANSPOND_PENDING:
            return Object.assign({}, initialState, {loading: true, items:[], errMessage:null});

        case DEVELOP_TRANSPOND_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload, loading: false, errMessage:null});

        case DEVELOP_TRANSPOND_ERROR:
            return {state, errMessage: action.payload.errorMsg, loading: false,};

        default:
            return state;
    }
}