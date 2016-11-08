/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import {
    CREATE_GROUP_PENDING,
    CREATE_GROUP_SUCCESS,
    CREATE_GROUP_ERROR,
    UPDATE_GROUP_PENDING,
    UPDATE_GROUP_SUCCESS,
    UPDATE_GROUP_ERROR,
    DELETE_GROUP_PENDING,
    DELETE_GROUP_SUCCESS,
    DELETE_GROUP_ERROR
} from '../constants/create-group-types';
import {RESET_DELETE_RESULT} from '../constants/create-project-types';

const initialState = {
};

export default function createGroup(state = initialState, action = {}) {
    switch (action.type) {
        case CREATE_GROUP_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});
        case CREATE_GROUP_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});
        case CREATE_GROUP_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false,
            };
        case UPDATE_GROUP_PENDING:
            return Object.assign({}, initialState, {updateLoading:true,updateDisabled:true});
        case UPDATE_GROUP_SUCCESS:
            return Object.assign({}, initialState, {updateResult: action.payload,updateLoading:false,updateDisabled:false});
        case UPDATE_GROUP_ERROR:
            return {
                ...state,
                updateErrors: action.payload.errorMsg,
                updateLoading:false,
                updateDisabled:false,
            };
        case DELETE_GROUP_PENDING:
            return Object.assign({}, initialState, {deleteLoading:true,deleteDisabled:true});
        case DELETE_GROUP_SUCCESS:
            return Object.assign({}, initialState, {deleteLoading:false,deleteDisabled:false,deleteResult: action.payload});
        case DELETE_GROUP_ERROR:
            return {
                ...state,
                deleteErrors: action.payload.errorMsg,
                deleteLoading:false,deleteDisabled:false
            };
        default:
            return state;
    }
}
