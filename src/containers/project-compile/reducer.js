/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/11/28
 */

import {
    PROJECT_COMPILE_GET_JOB_PENDING,
    PROJECT_COMPILE_GET_JOB_SUCCESS,
    PROJECT_COMPILE_GET_JOB_ERROR,
    PROJECT_COMPILE_SAVE_JOB_PENDING,
    PROJECT_COMPILE_SAVE_JOB_SUCCESS,
    PROJECT_COMPILE_SAVE_JOB_ERROR,
    PROJECT_COMPILE_BUILD_JOB_PENDING,
    PROJECT_COMPILE_BUILD_JOB_SUCCESS,
    PROJECT_COMPILE_BUILD_JOB_ERROR,
    PROJECT_COMPILE_BUILD_LIST_PENDING,
    PROJECT_COMPILE_BUILD_LIST_SUCCESS,
    PROJECT_COMPILE_BUILD_LIST_ERROR,
    PROJECT_COMPILE_CODE_CHANGES_PENDING,
    PROJECT_COMPILE_CODE_CHANGES_SUCCESS,
    PROJECT_COMPILE_CODE_CHANGES_ERROR
} from './action';

const initialState = {
    getLoading:false,
    saveLoading:false
};

export default function projectCompile(state = initialState, action = {}) {

    switch (action.type) {
        //get job
        case PROJECT_COMPILE_GET_JOB_PENDING:
            return {...state, jobInfo:{getLoading:true}};
        case PROJECT_COMPILE_GET_JOB_SUCCESS:
            return {...state, jobInfo: {...action.payload, getLoading:false}};
        case PROJECT_COMPILE_GET_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                jobInfo:{getLoading:false}
            };

        //save job
        case PROJECT_COMPILE_SAVE_JOB_PENDING:
            return {...state, saveJobResult: false, jobInfo: null, saveLoading:true};
        case PROJECT_COMPILE_SAVE_JOB_SUCCESS:
            return {...state, saveJobResult: true, jobInfo: action.payload, saveLoading:false};
        case PROJECT_COMPILE_SAVE_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                saveLoading:false
            };

        //build job
        case PROJECT_COMPILE_BUILD_JOB_PENDING:
            return {...state, buildJobResult: false, buildLoading:true};
        case PROJECT_COMPILE_BUILD_JOB_SUCCESS:
            return {...state, buildJobResult: true, buildLoading:false};
        case PROJECT_COMPILE_BUILD_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                buildLoading:false
            };

        //get build list
        case PROJECT_COMPILE_BUILD_LIST_PENDING:
            return {...state, buildList:{isLoading:true}};
        case PROJECT_COMPILE_BUILD_LIST_SUCCESS:
            return {...state, buildList: {...action.payload, isLoading:false}};
        case PROJECT_COMPILE_BUILD_LIST_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                buildList:{isLoading:false}
            };

        //get code changes
        case PROJECT_COMPILE_CODE_CHANGES_PENDING:
            return {...state, buildList:{codeChangesLoading:true}};
        case PROJECT_COMPILE_CODE_CHANGES_SUCCESS:
            return {...state, buildList: {...action.payload, codeChangesLoading:false}};
        case PROJECT_COMPILE_CODE_CHANGES_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                buildList:{codeChangesLoading:false}
            };

        default:
            return state;
    }
}
