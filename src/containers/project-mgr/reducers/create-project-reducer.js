/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import {
    CREATE_PROJECT_PENDING,
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_ERROR,
    UPDATE_PROJECT_PENDING,
    UPDATE_PROJECT_SUCCESS,
    UPDATE_PROJECT_ERROR,
    DELETE_PROJECT_PENDING,
    DELETE_PROJECT_SUCCESS,
    DELETE_PROJECT_ERROR,
    RESET_DELETE_RESULT
} from '../constants/create-project-types';

const initialState = {
};

export default function createProject(state = initialState, action = {}) {
    switch (action.type) {
        case CREATE_PROJECT_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});
        case CREATE_PROJECT_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});
        case CREATE_PROJECT_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false,
            };
        case UPDATE_PROJECT_PENDING:
            return Object.assign({}, initialState, {updateLoading:true,updateDisabled:true});
        case UPDATE_PROJECT_SUCCESS:
            return Object.assign({}, initialState, {updateResult: action.payload,updateLoading:false,updateDisabled:false});
        case UPDATE_PROJECT_ERROR:
            return {
                ...state,
                updateErrors: action.payload.errorMsg,
                updateLoading:false,
                updateDisabled:false,
            };
        case DELETE_PROJECT_PENDING:
            return Object.assign({}, initialState, {deleteLoading:true,deleteDisabled:true,deleteResult: "false"});
        case DELETE_PROJECT_SUCCESS:
            return Object.assign({}, initialState, {deleteLoading:false,deleteDisabled:false,deleteResult: "success"});
        case DELETE_PROJECT_ERROR:
            return {
                ...state,
                deleteResult: "false",
                deleteErrors: action.payload.errorMsg,
                deleteLoading:false,deleteDisabled:false
            };
        case RESET_DELETE_RESULT:
            return Object.assign({}, initialState, {deleteResult: action.data});
        default:
            return state;
    }
}
