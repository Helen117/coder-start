/**
 * Created by Administrator on 2016-11-10.
 */
import {
    CREATE_USER_PENDING,
    CREATE_USER_SUCCESS,
    CREATE_USER_ERROR,
    UPDATE_USER_PENDING,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    DELETE_USER_PENDING,
    DELETE_USER_SUCCESS,
    DELETE_USER_ERROR
} from '../constants/user-detail-types';

const initialState = {
};

export default function createUser(state = initialState, action = {}) {
    switch (action.type) {
        case CREATE_USER_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});
        case CREATE_USER_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});
        case CREATE_USER_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false,
            };
        case UPDATE_USER_PENDING:
            return Object.assign({}, initialState, {updateLoading:true,updateDisabled:true});
        case UPDATE_USER_SUCCESS:
            return Object.assign({}, initialState, {updateResult: action.payload,updateLoading:false,updateDisabled:false});
        case UPDATE_USER_ERROR:
            return {
                ...state,
                updateErrors: action.payload.errorMsg,
                updateLoading:false,
                updateDisabled:false,
            };
        case DELETE_USER_PENDING:
            return Object.assign({}, initialState, );
        case DELETE_USER_SUCCESS:
            return Object.assign({}, initialState, {deleteResult: action.payload});
        case DELETE_USER_ERROR:
            return {
                ...state,
                deleteErrors: action.payload.errorMsg,
            };
        default:
            return state;
    }
}