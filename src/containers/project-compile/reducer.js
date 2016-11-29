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
    getLoading:false,
    saveLoading:false
};

export default function projectCompile(state = initialState, action = {}) {

    switch (action.type) {
        //get job
        case PROJECT_COMPILE_GET_JOB_PENDING:
            return {...state, getLoading:true};
        case PROJECT_COMPILE_GET_JOB_SUCCESS:
            return {...state, jobInfo: action.payload, getLoading:false};
        case PROJECT_COMPILE_GET_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                getLoading:false
            };

        //save job
        case PROJECT_COMPILE_SAVE_JOB_PENDING:
            return {...state, saveLoading:true};
        case PROJECT_COMPILE_SAVE_JOB_SUCCESS:
            return {...state, saveJobResult: true, jobInfo: action.payload, saveLoading:false};
        case PROJECT_COMPILE_SAVE_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                saveLoading:false
            };

        default:
            return state;
    }
}
