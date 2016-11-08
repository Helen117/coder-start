/**
 * Created by Administrator on 2016-11-07.
 */
import api from '../../../api';
import {GET_USER_INFO} from '../constants/user-info-types';

export function getUserInfo(userId) {
    var path = '/userRelation';
    return {
        type: GET_USER_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    userId: userId
                }
            })
        }
    }
}