/**
 * Created by zhaojp on 2016/11/28.
 */
import {GET_PROJECT_INFO,
    DEVELOP_CONFIRM,
    GET_TRANSPOND_MEMBER,
    DEVELOP_TRANSPOND,
    GET_CONFIRM_LIST} from './action-types';
import api from '../../api';

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


export function getConfirmList(userId) {
    var path ='/aaa';
    return {
        type: GET_CONFIRM_LIST,
        payload: {
            promise: api.post(path, {
                params: {
                    userId: userId
                }
            })
        }
    }
}


export function getTranspondMember(id,type) {
    var path ='/aaa';
    return {
        type: GET_TRANSPOND_MEMBER,
        payload: {
            promise: api.post(path, {
                params: {
                    id: id,
                    type: type,
                    //role: role
                }
            })
        }
    }
}


export function developTranspond(data) {
    var path ='/aaa';
    return {
        type: DEVELOP_TRANSPOND,
        payload: {
            promise: api.post(path, {
                data: data
            })
        }
    }
}