/**
 * Created by Administrator on 2016-11-10.
 */
import api from '../../../api';
import {CREATE_USER, UPDATE_USER, DELETE_USER} from '../constants/user-detail-types';

export function createUser(groupData) {
    //var path = '/project-mgr/createGroup';
    var path = '/service-groups/add-user';
    return {
        type: CREATE_USER,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function UpdateUser(groupData) {
    var path = '/service-groups/update-user';
    return {
        type: UPDATE_USER,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function setUserDelete(username, groupId) {
    var path = '/service-groups/delete-user';
    return {
        type: DELETE_USER,
        payload: {
            promise: api.post(path, {
                params: {
                    username:username,
                    groupId: groupId
                }
            })
        }
    }
}