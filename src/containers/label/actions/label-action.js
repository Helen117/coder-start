/**
 * Created by helen on 2016/12/1.
 */

import api from '../../../api';

export function editLabel(data) {
    return {
        type: 'EDIT_LABEL',
        payload: {
            promise: api.post('/project/add-label', {
                data:data
            })
        }
    }
}

export function getLabelInfo() {
    return {
        type: 'FETCH_LABEL',
        payload: {
            promise: api.post('/project/labels')
        }
    }
}

export function updateLabel(data) {
    return {
        type: 'EDIT_LABEL',
        payload: {
            promise: api.post('/project/update-label', {
                data:data
            })
        }
    }
}

export function delLabel(label_id,userId,reason) {
    return {
        type: 'EDIT_LABEL',
        payload: {
            promise: api.post('/project/delete-label', {
                params: {
                    label_id: label_id,
                    user_id:userId,
                    reason:reason
                }
            })
        }
    }
}