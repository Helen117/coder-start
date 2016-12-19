/**
 * Created by zhaojp on 2016/10/24.
 */
import api from '../../api';
import {CREATE_PROJECT_SET,
    UPDATE_PROJECT_SET,
    DELETE_PROJECT_SET,
    PUT_PROJECT_SET_TO_STATE,
    FETCH_PROJECT_SET_TREE,
    GET_SET_PROJECTS} from './project-set-action-types';

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
                params: {
                    setsId: projectId,
                    userId: userId
                }
            })
        }
    }
}

export function putSelectedTreeItemToState(selectedItem) {
    return {
        type: PUT_PROJECT_SET_TO_STATE,
        payload: {
            data: selectedItem,
        }
    }
}

export function fetchProjectSetTree(userId) {
    var path ='/project/sets';
    return {
        type: FETCH_PROJECT_SET_TREE,
        payload: {
            promise: api.post(path, {
                params: {
                    userId:userId
                }
            })
        }
    }
}

export function getSetProject(userId) {
    var path ='/project/get-set-projects';
    return {
        type: GET_SET_PROJECTS,
        payload: {
            promise: api.post(path, {
                params: {
                    userId:userId
                }
            })
        }
    }
}

export function getProjectInfo(project_id,user_id) {
    var path = '/project/info';
    return {
        type: 'GET_PROJECT_INFO',
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
