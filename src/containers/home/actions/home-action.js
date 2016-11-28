/**
 * Created by zhaojp on 2016/11/23.
 */
import api from '../../../api';
import {ACQUIRE_PERFORMANCE_MSG,ACQUIRE_MY_ISSUE_LIST} from '../constants/home-action-types';

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

export function acqMyIssueList(userId) {
    var path = '/project/create-milestone';
    return {
        type: ACQUIRE_MY_ISSUE_LIST,
        payload: {
            promise: api.post(path, {
                params: {
                    userId: userId
                }
            })
        }
    }
}

export function getNotifyItems(userId) {
    return {
        type: 'NOTIFY_ITEM',
        payload: {
            promise: api.post('/user/notify-num', {
                params: {
                    userId: userId
                }
            })
        }
    }
}
