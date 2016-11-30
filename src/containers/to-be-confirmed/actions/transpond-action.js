/**
 * Created by zhaojp on 2016/11/28.
 */
import {GET_TRANSPOND_MEMBER,
    DEVELOP_TRANSPOND} from '../constants/to-be-confirmed-action-types';
import api from '../../../api';

export function getTranspondMember(id,type) {
    var path ='/project/assign-list';
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