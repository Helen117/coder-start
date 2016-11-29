/**
 * Created by zhaojp on 2016/11/28.
 */
import {GET_TRANSPOND_MEMBER,
    DEVELOP_TRANSPOND} from '../constants/to-be-confirmed-action-types';
import api from '../../../api';

export function getTranspondMember(id) {
    var path ='/aaa';
    return {
        type: GET_TRANSPOND_MEMBER,
        payload: {
            promise: api.post(path, {
                params: {
                    id: id
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