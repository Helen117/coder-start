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
    DELETE_GROUP_ERROR,
    GET_GROUP_INFO_SUCCESS,
    CLEAR_GROUP_PROJECT_INFO
} from '../constants/create-group-types';

const initialState = {
};

export default function projectGroup(state = initialState, action = {}) {
    switch (action.type) {
        //获取项目组
        case GET_GROUP_INFO_SUCCESS:
            return {...state, getGroupInfo:{groupInfo: action.data, selectedNode: action.selectNodeData,
            node:action.node}};
        case CLEAR_GROUP_PROJECT_INFO:
            return {...state,getGroupInfo:{}};
        //创建项目组
        case CREATE_GROUP_PENDING:
            return {...state, createGroup:{loading:true,disabled:true}};
        case CREATE_GROUP_SUCCESS:
            return {...state, createGroup:{result: action.payload,loading:false,disabled:false}};
        case CREATE_GROUP_ERROR:
            return {
                ...state,createGroup:{loading:false, disabled:false}
            };
        //更新项目组
        case UPDATE_GROUP_PENDING:
            return {...state, updateGroup:{loading:true,disabled:true}};
        case UPDATE_GROUP_SUCCESS:
            return {...state, updateGroup:{result: action.payload,loading:false,disabled:false}};
        case UPDATE_GROUP_ERROR:
            return {
                ...state,updateGroup:{loading:false, disabled:false}
            };
        //删除项目组
        case DELETE_GROUP_PENDING:
            return {...state,deleteGroup:{loading:true}};
        case DELETE_GROUP_SUCCESS:
            return {...state, deleteGroup:{result: action.payload,loading:false}};
        case DELETE_GROUP_ERROR:
            return {
                ...state,deleteGroup:{loading:true}
            };
        default:
            return state;
    }
}
