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
    GET_PROJECT_INFO_SUCCESS,
    GET_PROJECT_INFO_PENDING,
    GET_PROJECT_INFO_ERROR
} from '../constants/create-project-types';
import {CLEAR_GROUP_PROJECT_INFO} from '../constants/create-group-types';

const initialState = {
};

export default function project(state = initialState, action = {}) {
    switch (action.type) {
        //获取项目
        case GET_PROJECT_INFO_PENDING:
            return {...state, getProjectInfo:{fetchProjectStatus: false,loading:true}};
        case GET_PROJECT_INFO_SUCCESS:
            return {...state, getProjectInfo:{fetchProjectStatus: true,projectInfo: action.payload, loading:false}};
        case GET_PROJECT_INFO_ERROR:
            return {
                ...state,getProjectInfo:{loading:false}
            };
        case CLEAR_GROUP_PROJECT_INFO:
            return {...state,getProjectInfo:{}};
        //创建项目
        case CREATE_PROJECT_PENDING:
            return {...state, createProject:{loading:true,disabled:true}};
        case CREATE_PROJECT_SUCCESS:
            return {...state, createProject:{result: action.payload,loading:false,disabled:false}};
        case CREATE_PROJECT_ERROR:
            return {
                ...state,createProject:{loading:false, disabled:false,}
            };
        //更新项目
        case UPDATE_PROJECT_PENDING:
            return {...state, updateProject:{loading:true,disabled:true}};
        case UPDATE_PROJECT_SUCCESS:
            return {...state, updateProject:{result: action.payload,loading:false,disabled:false}};
        case UPDATE_PROJECT_ERROR:
            return {
                ...state,updateProject:{loading:false, disabled:false,}
            };
        //删除项目
        case DELETE_PROJECT_PENDING:
            return {...state, deleteProject:{loading:true}};
        case DELETE_PROJECT_SUCCESS:
            return {...state, deleteProject:{result: action.payload,loading:false}};
        case DELETE_PROJECT_ERROR:
            return {
                ...state,deleteProject:{loading:true}
            };
        default:
            return state;
    }
}
