/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import api from '../../../api';
import {CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, RESET_DELETE_RESULT} from '../constants/create-project-types';

export function createProject(projectData) {
    //var path = '/project-mgr/createProject';
    var path = '/project/create';
    return {
        type: CREATE_PROJECT,
        payload: {
            promise: api.post(path, {
                data: projectData
            })
        }
    }
}

export function UpdateProject(projectData) {
    var path = '/project/update';
    return {
        type: UPDATE_PROJECT,
        payload: {
            promise: api.post(path, {
                data: projectData
            })
        }
    }
}

export function setProjectDelete(projectId) {
    var path = '/project/delete';
    return {
        type: DELETE_PROJECT,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}

export function resetDeleteResult(resetResult) {
    if (resetResult) {
        return {
            type:RESET_DELETE_RESULT,
            data:resetResult,
        }
    }
}
