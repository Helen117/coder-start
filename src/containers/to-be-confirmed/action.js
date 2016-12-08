/**
 * Created by zhaojp on 2016/11/28.
 */
import {GET_PROJECT_INFO,
    DEVELOP_CONFIRM,
    GET_TRANSPOND_MEMBER,
    DEVELOP_TRANSPOND,
    GET_CONFIRM_LIST} from './action-types';
import api from '../../api';

export function getProjectInfo(set_id,user_id) {
    var path ='/project/demand-project';
    return {
        type: GET_PROJECT_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    set_id: set_id,
                    user_id: user_id
                }
            })
        }
    }
}


export function developConfirm(data) {
    var path ='/examination/demand-examine';
    return {
        type: DEVELOP_CONFIRM,
        payload: {
            promise: api.post(path, {
                data: data
            })
        }
    }
}


export function getConfirmList(task_id) {
    var path ='/examination/info';
    return {
        type: GET_CONFIRM_LIST,
        payload: {
            promise: api.post(path, {
                params: {
                    task_id: task_id,
                }
            })
        }
    }
}


export function getTranspondMember(id,type,role) {
    var path ='/project/assign-list';
    return {
        type: GET_TRANSPOND_MEMBER,
        payload: {
            promise: api.post(path, {
                params: {
                    id: id,
                    type:type,
                    role:role
                }
            })
        }
    }
}


export function developTranspond(data) {
    var path ='/examination/demand-examine';
    return {
        type: DEVELOP_TRANSPOND,
        payload: {
            promise: api.post(path, {
                data: data
            })
        }
    }
}