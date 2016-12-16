/**
 * Created by helen on 2016/10/31.
 */
import api from '../../../api';

export function getApproveList(username) {
    return {
        type: 'GET_APPROVE_LIST',
        payload: {
            promise: api.post('/examination/backlog', {
                params: {
                    username: username
                }
            })
        }
    }
}

export function approvalDetail(task_id) {
    return {
        type: 'APPROVAL_DETAIL',
        payload: {
            promise: api.post('/examination/info', {
                params: {
                    task_id: task_id
                }
            })
        }
    }
}

export function approveResult(data) {
    return {
        type: 'APPROVE_RESULT',
        payload: {
            promise: api.post('/examination/register-examine', {
                data:data
            })
        }
    }
}