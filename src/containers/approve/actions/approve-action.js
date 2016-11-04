/**
 * Created by helen on 2016/10/31.
 */
import api from '../../../api';

export function getApproveList(userId) {
    return {
        type: 'GET_APPROVE_LIST',
        payload: {
            promise: api.post('http://10.10.152.144:11000/examination/list', {
                params: {
                    leaderId: userId
                }
            })
        }
    }
}

export function approveResult(data) {
    return {
        type: 'APPROVE_RESULT',
        payload: {
            promise: api.post('http://10.10.152.144:11000/examination/updateExamination', {
                data:data
            })
        }
    }
}