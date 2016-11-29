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
    PROJECT_COMPILE_SAVE_JOB_ERROR
} from './action';

const initialState = {
    loading:false
};

export default function projectCompile(state = initialState, action = {}) {

    switch (action.type) {
        //get job
        case PROJECT_COMPILE_GET_JOB_PENDING:
            return Object.assign({}, initialState, {loading:true});
        case PROJECT_COMPILE_GET_JOB_SUCCESS:
            return Object.assign({}, initialState, {jobInfo: action.payload,loading:false});
        case PROJECT_COMPILE_GET_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false
            };

        //save job
        case PROJECT_COMPILE_SAVE_JOB_PENDING:
            return Object.assign({}, initialState, {loading:true});
        case PROJECT_COMPILE_SAVE_JOB_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false});
        case PROJECT_COMPILE_SAVE_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false
            };

        default:
            return state;
    }
}
