/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/11/28
 */
import api from '../../api';

export const PROJECT_COMPILE_GET_JOB = 'PROJECT_COMPILE_GET_JOB';
export const PROJECT_COMPILE_GET_JOB_PENDING = 'PROJECT_COMPILE_GET_JOB_PENDING';
export const PROJECT_COMPILE_GET_JOB_SUCCESS = 'PROJECT_COMPILE_GET_JOB_SUCCESS';
export const PROJECT_COMPILE_GET_JOB_ERROR = 'PROJECT_COMPILE_GET_JOB_ERROR';

export function getJob(jobName) {
    var path = '/jenkins/getJob';
    return {
        type: PROJECT_COMPILE_GET_JOB,
        payload: {
            promise: api.post(path, {
                params: {
                    jobName: jobName
                },
                urlType:'ci'
            })
        }
    }
}

export const PROJECT_COMPILE_SAVE_JOB = 'PROJECT_COMPILE_SAVE_JOB';
export const PROJECT_COMPILE_SAVE_JOB_PENDING = 'PROJECT_COMPILE_SAVE_JOB_PENDING';
export const PROJECT_COMPILE_SAVE_JOB_SUCCESS = 'PROJECT_COMPILE_SAVE_JOB_SUCCESS';
export const PROJECT_COMPILE_SAVE_JOB_ERROR = 'PROJECT_COMPILE_SAVE_JOB_ERROR';

export function saveJob(jobInfo) {
    var path = '/jenkins/saveJob';
    return {
        type: PROJECT_COMPILE_SAVE_JOB,
        payload: {
            promise: api.post(path, {
                data: {
                    jobInfo: jobInfo
                }
            })
        }
    }
}
