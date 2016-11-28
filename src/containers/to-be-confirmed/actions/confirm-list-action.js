/**
 * Created by zhaojp on 2016/11/28.
 */

import {GET_CONFIRM_LIST} from '../constants/to-be-confirmed-action-types';
import api from '../../../api';

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