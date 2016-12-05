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

const initialState = {
};

export default function createGroup(state = initialState, action = {}) {
    switch (action.type) {
        //创建项目组
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
        //更新项目组
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
        //删除项目组
        case DELETE_GROUP_PENDING:
            return Object.assign({}, initialState, );
        case DELETE_GROUP_SUCCESS:
            return Object.assign({}, initialState, {deleteResult: action.payload});
        case DELETE_GROUP_ERROR:
            return {
                ...state,
                deleteErrors: action.payload.errorMsg,
            };
        default:
            return state;
    }
}
