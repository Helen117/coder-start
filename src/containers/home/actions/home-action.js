/**
 * Created by zhaojp on 2016/11/23.
 */
import api from '../../../api';
import {ACQUIRE_PERFORMANCE_MSG} from '../constants/home-action-types';

export function acqPerformanceMsg(userId) {
    var path = '/project/create-milestone';
    return {
        type: ACQUIRE_PERFORMANCE_MSG,
        payload: {
            promise: api.post(path, {
                params: {
                    userId: userId
                }
            })
        }
    }
}