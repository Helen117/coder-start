/**
 * Created by Administrator on 2016-11-08.
 */
import api from '../../../api';
import {CREATE_USER_GROUP, UPDATE_USER_GROUP, DELETE_USER_GROUP} from '../constants/user-group-detail-types';

export function createUserGroup(groupData) {
    //var path = '/project-mgr/createGroup';
    var path = '/groups/create';
    return {
        type: CREATE_USER_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function UpdateUserGroup(groupData) {
    var path = '/groups/update';
    return {
        type: UPDATE_USER_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function setUserGroupDelete(username, groupId) {
    var path = '/groups/delete';
    return {
        type: DELETE_USER_GROUP,
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