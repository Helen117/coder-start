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
    PROJECT_COMPILE_CODE_CHANGES_ERROR,
    PROJECT_COMPILE_STAGES_PENDING,
    PROJECT_COMPILE_STAGES_SUCCESS,
    PROJECT_COMPILE_STAGES_ERROR,

    PROJECT_COMPILE_SAVE_PIPELINE_JOB_PENDING,
    PROJECT_COMPILE_SAVE_PIPELINE_JOB_SUCCESS,
    PROJECT_COMPILE_SAVE_PIPELINE_JOB_ERROR,
    PROJECT_COMPILE_GET_PIPELINE_JOB_PENDING,
    PROJECT_COMPILE_GET_PIPELINE_JOB_SUCCESS,
    PROJECT_COMPILE_GET_PIPELINE_JOB_ERROR,

    PROJECT_COMPILE_GET_PIPELINE_SCRIPT_PENDING,
    PROJECT_COMPILE_GET_PIPELINE_SCRIPT_SUCCESS,
    PROJECT_COMPILE_GET_PIPELINE_SCRIPT_ERROR,
    PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_PENDING,
    PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_SUCCESS,
    PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_ERROR,

    PROJECT_COMPILE_GET_DEPLOY_HOSTS_PENDING,
    PROJECT_COMPILE_GET_DEPLOY_HOSTS_SUCCESS,
    PROJECT_COMPILE_GET_DEPLOY_HOSTS_ERROR,

    PROJECT_COMPILE_SAVE_DEPLOY_HOST_PENDING,
    PROJECT_COMPILE_SAVE_DEPLOY_HOST_SUCCESS,
    PROJECT_COMPILE_SAVE_DEPLOY_HOST_ERROR


} from './action';

const initialState = {
    getLoading:false,
    saveLoading:false,
    getPipelineJobLoading: false,
    savePipelineJobLoading: false,
    savePipelineScriptLoading: false,
    saveDeployHostLoading: false
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


        //get stages
        case PROJECT_COMPILE_STAGES_PENDING:
            return {...state, stageLoading:true};
        case PROJECT_COMPILE_STAGES_SUCCESS:
            return {...state, stageList: action.payload, stageLoading:false};
        case PROJECT_COMPILE_STAGES_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                stageLoading:false
            };


        //save pipeline job
        case PROJECT_COMPILE_SAVE_PIPELINE_JOB_PENDING:
            return {...state, savePipelineJobResult: false, savePipelineJobLoading:true};
        case PROJECT_COMPILE_SAVE_PIPELINE_JOB_SUCCESS:
            return {...state, savePipelineJobResult: true, savePipelineJobLoading:false};
        case PROJECT_COMPILE_SAVE_PIPELINE_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                savePipelineJobLoading:false
            };


        //get pipeline job
        case PROJECT_COMPILE_GET_PIPELINE_JOB_PENDING:
            return {...state, pipelineJobInfo: null, getPipelineJobLoading:true};
        case PROJECT_COMPILE_GET_PIPELINE_JOB_SUCCESS:
            return {...state, pipelineJobInfo: action.payload, getPipelineJobLoading:false};
        case PROJECT_COMPILE_GET_PIPELINE_JOB_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                getPipelineJobLoading:false
            };



        //get pipeline script
        case PROJECT_COMPILE_GET_PIPELINE_SCRIPT_PENDING:
            return {...state, pipelineScriptInfo: null, getPipelineScriptLoading:true};
        case PROJECT_COMPILE_GET_PIPELINE_SCRIPT_SUCCESS:
            return {...state, pipelineScriptInfo: action.payload, getPipelineScriptLoading:false};
        case PROJECT_COMPILE_GET_PIPELINE_SCRIPT_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                getPipelineScriptLoading:false
            };





        //save pipeline script
        case PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_PENDING:
            return {...state, savePipelineScriptResult: false, savePipelineScriptLoading:true};
        case PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_SUCCESS:
            return {...state, savePipelineScriptResult: true, savePipelineScriptLoading:false};
        case PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                savePipelineScriptLoading:false
            };




        //get deploy host list
        case PROJECT_COMPILE_GET_DEPLOY_HOSTS_PENDING:
            return {...state, deployHostList:{isLoading:true}};
        case PROJECT_COMPILE_GET_DEPLOY_HOSTS_SUCCESS:
            return {...state, deployHostList: {...action.payload, isLoading:false}};
        case PROJECT_COMPILE_GET_DEPLOY_HOSTS_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                deployHostList:{isLoading:false}
            };



        //save deploy host
        case PROJECT_COMPILE_SAVE_DEPLOY_HOST_PENDING:
            return {...state, saveDeployHostResult: false, saveDeployHostLoading:true};
        case PROJECT_COMPILE_SAVE_DEPLOY_HOST_SUCCESS:
            return {...state, saveDeployHostResult: true, saveDeployHostLoading:false};
        case PROJECT_COMPILE_SAVE_DEPLOY_HOST_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                saveDeployHostLoading:false
            };


        default:
            return state;
    }
}
