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
    var path = '/getJob';
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
    var path = '/saveJob';
    return {
        type: PROJECT_COMPILE_SAVE_JOB,
        payload: {
            promise: api.post(path, {
                data: jobInfo,
                urlType:'ci'
            })
        }
    }
}


export const PROJECT_COMPILE_BUILD_JOB = 'PROJECT_COMPILE_BUILD_JOB';
export const PROJECT_COMPILE_BUILD_JOB_PENDING = 'PROJECT_COMPILE_BUILD_JOB_PENDING';
export const PROJECT_COMPILE_BUILD_JOB_SUCCESS = 'PROJECT_COMPILE_BUILD_JOB_SUCCESS';
export const PROJECT_COMPILE_BUILD_JOB_ERROR = 'PROJECT_COMPILE_BUILD_JOB_ERROR';

export function buildJob(jobName) {
    var path = '/buildJob';
    return {
        type: PROJECT_COMPILE_BUILD_JOB,
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

export const PROJECT_COMPILE_BUILD_LIST = 'PROJECT_COMPILE_BUILD_LIST';
export const PROJECT_COMPILE_BUILD_LIST_PENDING = 'PROJECT_COMPILE_BUILD_LIST_PENDING';
export const PROJECT_COMPILE_BUILD_LIST_SUCCESS = 'PROJECT_COMPILE_BUILD_LIST_SUCCESS';
export const PROJECT_COMPILE_BUILD_LIST_ERROR = 'PROJECT_COMPILE_BUILD_LIST_ERROR';

export function getBuildList(projectId) {
    var path = '/getBuildList';
    return {
        type: PROJECT_COMPILE_BUILD_LIST,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId,
                    limit:5
                },
                urlType:'ci'
            })
        }
    }
}


export const PROJECT_COMPILE_CODE_CHANGES = 'PROJECT_COMPILE_CODE_CHANGES';
export const PROJECT_COMPILE_CODE_CHANGES_PENDING = 'PROJECT_COMPILE_CODE_CHANGES_PENDING';
export const PROJECT_COMPILE_CODE_CHANGES_SUCCESS = 'PROJECT_COMPILE_CODE_CHANGES_SUCCESS';
export const PROJECT_COMPILE_CODE_CHANGES_ERROR = 'PROJECT_COMPILE_CODE_CHANGES_ERROR';

export function getCodeChanges(projectId, gitCommitId, lastGitCommitId) {
    var path = '/repository/compare-commits';
    return {
        type: PROJECT_COMPILE_CODE_CHANGES,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId:projectId,
                    from: lastGitCommitId,
                    to: gitCommitId
                }
            })
        }
    }
}
