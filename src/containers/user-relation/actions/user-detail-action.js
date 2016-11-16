/**
 * Created by Administrator on 2016-11-10.
 */
import api from '../../../api';
import {MOVE_USER,DELETE_GROUP_USER,UPDATE_USER} from '../constants/user-detail-types';

export function MoveUser(groupData) {
    var path = '/service-groups/move-group-user';
    return {
        type: MOVE_USER,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function DeleteGroupUser(groupData) {
    var path = '/service-groups/delete-group-user';
    return {
        type: DELETE_GROUP_USER,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function UpdateUser(groupData) {
    var path = '/user/update';
    return {
        type: UPDATE_USER,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}