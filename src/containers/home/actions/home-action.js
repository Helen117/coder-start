/**
 * Created by zhaojp on 2016/11/23.
 */
import api from '../../../api';
import {ACQUIRE_PERFORMANCE_MSG,
    ACQUIRE_MY_ISSUE_LIST,
    ACQUIRE_USER_RANKING} from '../constants/home-action-types';

export function acqPerformanceMsg(userId) {
    var path = '/user/performance';
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

export function acqUserRanking(userId) {
    var path = '/user/ranking';
    return {
        type: ACQUIRE_USER_RANKING,
        payload: {
            promise: api.post(path, {
                params: {
                    user_id: userId
                }
            })
        }
    }
}


export function acqMyIssueList(userId,state) {
    var path = '/project/issue-backlog';
    return {
        type: ACQUIRE_MY_ISSUE_LIST,
        payload: {
            promise: api.post(path, {
                data: {
                    assigned_id: userId,
                    state: state
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
