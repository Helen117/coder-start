/**
 * Created by zhaojp on 2016/10/24.
 */
import api from '../../../api';
import {CREATE_PROJECT_SET,UPDATE_PROJECT_SET,DELETE_PROJECT_SET} from '../constants/project-set-action-types';

export function createProjectSet(projectSetData) {
    var path = '/project/create-set';
    return {
        type: CREATE_PROJECT_SET,
        payload: {
            promise: api.post(path, {
                data: projectSetData
            })
        }
    }
}

export function updateProjectSet(projectSetData) {
    var path = '/project/update-set';
    return {
        type: UPDATE_PROJECT_SET,
        payload: {
            promise: api.post(path, {
                data: projectSetData
            })
        }
    }
}

export function deleteProjectSet(projectId,userId) {
    var path = '/project/delete-set';
    return {
        type: DELETE_PROJECT_SET,
        payload: {
            promise: api.post(path, {
                setsId: projectId,
                userId: userId
            })
        }
    }
}