/**
 * Created by Administrator on 2016-11-18.
 */
import api from '../../../api';
import {ADD_PROJECT_MEMBER,DELETE_PROJECT_MEMBER,
    GET_PROJECTMEMBERS, UPDATE_PROJECT_MEMBER} from '../constants/project-member-types';

export function addProjectMember(addInfo) {
    var path = '/project/add-member';
    return {
        type: ADD_PROJECT_MEMBER,
        payload: {
            promise: api.post(path,{
                data: addInfo
            })
        }
    }
}

export function deleteProjectMember(deleteInfo) {
    var path = '/project/delete-member';
    return {
        type: DELETE_PROJECT_MEMBER,
        payload: {
            promise: api.post(path,{
                data: deleteInfo
            })
        }
    }
}

export function getProjectMembers(projectId) {
    var path = '/project/members';
    return {
        type: GET_PROJECTMEMBERS,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}

export function updateProjectMember(project_id,user_id,role) {
    var path = '/project/update-role';
    return {
        type: UPDATE_PROJECT_MEMBER,
        payload: {
            promise: api.post(path,{
                params:{
                    project_id:project_id,
                    user_id:user_id,
                    role:role
                }
            })
        }
    }
}