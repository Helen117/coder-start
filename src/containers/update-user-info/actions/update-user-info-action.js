/**
 * Created by Administrator on 2016-12-02.
 */
import api from '../../../api';
import {GET_ALL_USER_INFO,UPDATE_USER_INFO,
    ADD_SSHKEY,GET_SSHKEYS,DELETE_SSHKEYS} from '../constants/update-user-info-types';

export function UpdateUser(userData) {
    var path = '/user/update';
    return {
        type: UPDATE_USER_INFO,
        payload: {
            promise: api.post(path, {
                data: userData
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

export function AddSshKeys(username,title,sshKey) {
    var path = '/user/add-key';
    return {
        type: ADD_SSHKEY,
        payload: {
            promise: api.post(path, {
                params:{
                    username:username,
                    title:title,
                    sshKey:sshKey
                }
            })
        }
    }
}

export function GetSshKeys(user_id) {
    var path = '/user/key-list';
    return {
        type: GET_SSHKEYS,
        payload: {
            promise: api.post(path, {
                params:{
                    user_id:user_id,
                }
            })
        }
    }
}

export function DeleteSshKeys(user_id,key_id) {
    var path = '/user/delete-key';
    return {
        type: DELETE_SSHKEYS,
        payload: {
            promise: api.post(path, {
                params:{
                    user_id:user_id,
                    key_id:key_id
                }
            })
        }
    }
}