/**
 * Created by Administrator on 2016-11-18.
 */
import api from '../../../api';
import {ADD_SSHKEY,GET_SSHKEYS,DELETE_SSHKEYS} from '../constants/ssh-key-types';

export function AddSshKey(username,title,sshKey) {
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