/**
 * Created by Administrator on 2016-11-07.
 */
import api from '../../../api';
import {GET_USER_INFO, GET_ALL_USER_INFO} from '../constants/user-info-types';

export function getUserInfo(group_id) {
    var path = '/service-groups/users';
    return {
        type: GET_USER_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    group_id: group_id
                }
            })
        }
    }
}

export function getAllUserInfo() {
    var path = '/service-groups/user-list';
    return {
        type: GET_ALL_USER_INFO,
        payload: {
            promise: api.post(path, {
                params: {

                }
            })
        }
    }
}