/**
 * Created by Administrator on 2016-11-18.
 */
import {
    ADD_SSHKEY_PENDING,
    ADD_SSHKEY_SUCCESS,
    ADD_SSHKEY_ERROR,
    GET_SSHKEYS_PENDING,
    GET_SSHKEYS_SUCCESS,
    GET_SSHKEYS_ERROR,
    DELETE_SSHKEYS_PENDING,
    DELETE_SSHKEYS_SUCCESS,
    DELETE_SSHKEYS_ERROR
} from '../constants/ssh-key-types';

const initialState = {
};

export function AddSshKey(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_SSHKEY_PENDING:
            return Object.assign({}, initialState, {addLoading:true,addDisabled:true});
        case ADD_SSHKEY_SUCCESS:
            return Object.assign({}, initialState, {addResult: action.payload,addLoading:false,
                addDisabled:false});
        case ADD_SSHKEY_ERROR:
            return {
                ...state,
                addErrors: action.payload.errorMsg,
                addLoading:false,
                addDisabled:false,
            };
        case DELETE_SSHKEYS_PENDING:
            return Object.assign({}, initialState, {deleteLoading:true,deleteDisabled:true});
        case DELETE_SSHKEYS_SUCCESS:
            return Object.assign({}, initialState, {deleteResult: action.payload,deleteLoading:false,
                deleteDisabled:false});
        case DELETE_SSHKEYS_ERROR:
            return {
                ...state,
                deleteErrors: action.payload.errorMsg,
                deleteLoading:false,
                deleteDisabled:false,
            };
        default:
            return state;
    }
}

export function GetSshKeys(state = initialState, action = {}) {
    switch (action.type) {
        case GET_SSHKEYS_PENDING:
            return Object.assign({}, initialState, {Loading:true,Disabled:true});
        case GET_SSHKEYS_SUCCESS:
            return Object.assign({}, initialState, {Result: action.payload,Loading:false,
                Disabled:false});
        case GET_SSHKEYS_ERROR:
            return {
                ...state,
                Errors: action.payload.errorMsg,
                Loading:false,
                Disabled:false,
            };
        default:
            return state;
    }
}