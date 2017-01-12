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


export const PROJECT_COMPILE_STAGES = 'PROJECT_COMPILE_STAGES';
export const PROJECT_COMPILE_STAGES_PENDING = 'PROJECT_COMPILE_STAGES_PENDING';
export const PROJECT_COMPILE_STAGES_SUCCESS = 'PROJECT_COMPILE_STAGES_SUCCESS';
export const PROJECT_COMPILE_STAGES_ERROR = 'PROJECT_COMPILE_STAGES_ERROR';

export function getStageList() {
    var path = '/getStageList';
    return {
        type: PROJECT_COMPILE_STAGES,
        payload: {
            promise: api.get(path, {
                urlType:'ci'
            })
        }
    }
}


export const PROJECT_COMPILE_SAVE_PIPELINE_JOB = 'PROJECT_COMPILE_SAVE_PIPELINE_JOB';
export const PROJECT_COMPILE_SAVE_PIPELINE_JOB_PENDING = 'PROJECT_COMPILE_SAVE_PIPELINE_JOB_PENDING';
export const PROJECT_COMPILE_SAVE_PIPELINE_JOB_SUCCESS = 'PROJECT_COMPILE_SAVE_PIPELINE_JOB_SUCCESS';
export const PROJECT_COMPILE_SAVE_PIPELINE_JOB_ERROR = 'PROJECT_COMPILE_SAVE_PIPELINE_JOB_ERROR';

export function savePipelineJob(pipelineJobInfo) {
    var path = '/savePipelineJob';
    return {
        type: PROJECT_COMPILE_SAVE_PIPELINE_JOB,
        payload: {
            promise: api.post(path, {
                data: pipelineJobInfo,
                urlType:'ci'
            })
        }
    }
}

export const PROJECT_COMPILE_GET_PIPELINE_JOB = 'PROJECT_COMPILE_GET_PIPELINE_JOB';
export const PROJECT_COMPILE_GET_PIPELINE_JOB_PENDING = 'PROJECT_COMPILE_GET_PIPELINE_JOB_PENDING';
export const PROJECT_COMPILE_GET_PIPELINE_JOB_SUCCESS = 'PROJECT_COMPILE_GET_PIPELINE_JOB_SUCCESS';
export const PROJECT_COMPILE_GET_PIPELINE_JOB_ERROR = 'PROJECT_COMPILE_GET_PIPELINE_JOB_ERROR';

export function getPipelineJob(jobName, branchName) {
    var path = '/getPipelineJob';
    return {
        type: PROJECT_COMPILE_GET_PIPELINE_JOB,
        payload: {
            promise: api.get(path, {
                params: {
                    jobName: jobName,
                    branchName: branchName
                },
                urlType:'ci'
            })
        }
    }
}



export const PROJECT_COMPILE_GET_PIPELINE_SCRIPT = 'PROJECT_COMPILE_GET_PIPELINE_SCRIPT';
export const PROJECT_COMPILE_GET_PIPELINE_SCRIPT_PENDING = 'PROJECT_COMPILE_GET_PIPELINE_SCRIPT_PENDING';
export const PROJECT_COMPILE_GET_PIPELINE_SCRIPT_SUCCESS = 'PROJECT_COMPILE_GET_PIPELINE_SCRIPT_SUCCESS';
export const PROJECT_COMPILE_GET_PIPELINE_SCRIPT_ERROR = 'PROJECT_COMPILE_GET_PIPELINE_SCRIPT_ERROR';

export function getPipelineScript(jobName) {
    var path = '/getPipelineScript';
    return {
        type: PROJECT_COMPILE_GET_PIPELINE_SCRIPT,
        payload: {
            promise: api.get(path, {
                params: {
                    jobName: jobName
                },
                urlType:'ci'
            })
        }
    }
}



export const PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT = 'PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT';
export const PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_PENDING = 'PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_PENDING';
export const PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_SUCCESS = 'PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_SUCCESS';
export const PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_ERROR = 'PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT_ERROR';

export function savePipelineScript(pipelineScriptInfo) {
    var path = '/savePipelineScript';
    return {
        type: PROJECT_COMPILE_SAVE_PIPELINE_SCRIPT,
        payload: {
            promise: api.post(path, {
                data: pipelineScriptInfo,
                urlType:'ci'
            })
        }
    }
}
