/**
 * Created by Administrator on 2016-11-08.
 */
import api from '../../../api';
import {CREATE_USER_GROUP, UPDATE_USER_GROUP, DELETE_USER_GROUP} from '../constants/user-group-detail-types';

export function createUserGroup(groupData) {
    var path = '/service-groups/add';
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
    var path = '/service-groups/update';
    return {
        type: UPDATE_USER_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function setUserGroupDelete(group_id, user_id) {
    var path = '/service-groups/delete';
    return {
        type: DELETE_USER_GROUP,
        payload: {
            promise: api.post(path, {
                params: {
                    user_id:user_id,
                    group_id: group_id
                }
            })
        }
    }
}