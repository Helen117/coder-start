/**
 * Created by zhaojp on 2016/11/28.
 */
import {GET_PROJECT_INFO,
    DEVELOP_CONFIRM} from '../constants/to-be-confirmed-action-types';
import api from '../../../api';

export function getProjectInfo(userId) {
    var path ='/aaa';
    return {
        type: GET_PROJECT_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    userId: userId
                }
            })
        }
    }
}


export function developConfirm(data) {
    var path ='/aaa';
    return {
        type: DEVELOP_CONFIRM,
        payload: {
            promise: api.post(path, {
                data: data
            })
        }
    }
}