/**
 * Created by zhaojp on 2017/1/3.
 */

import api from '../../api';
import {PUSH_CODE_TO_MASTER,
    PUSH_CODE_TO_RELEASE} from './action-types';

export function pushCodeToRelease(user_id, set_id){
    var path = '/project/auto-merge';
    return {
        type: PUSH_CODE_TO_RELEASE,
        payload: {
            promise: api.post(path, {
                params:{
                    user_id: user_id,
                    set_id: set_id,
                    branch: 'release'
                }
            })
        }
    }
}

export function pushCodeToMaster(user_id, set_id){
    var path = '/project/auto-merge';
    return {
        type: PUSH_CODE_TO_MASTER,
        payload: {
            promise: api.post(path, {
                params:{
                    user_id: user_id,
                    set_id: set_id,
                    branch: 'master'
                }
            })
        }
    }
}