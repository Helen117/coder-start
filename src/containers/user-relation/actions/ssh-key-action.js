/**
 * Created by Administrator on 2016-11-18.
 */
import api from '../../../api';
import {ADD_SSHKEY} from '../constants/ssh-key-types';

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