/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import api from '../../../api';
import {CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT,GET_PROJECT_INFO} from '../constants/create-project-types';

export function getProjectInfo(project_id,user_id) {
    var path = '/project/info';
    return {
        type: GET_PROJECT_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    project_id: project_id,
                    user_id:user_id
                }
            })
        }
    }
}

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

export function setProjectDelete(username,projectId) {
    var path = '/project/delete';
    return {
        type: DELETE_PROJECT,
        payload: {
            promise: api.post(path, {
                params: {
                    username:username,
                    projectId: projectId
                }
            })
        }
    }
}

