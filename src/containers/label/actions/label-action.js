/**
 * Created by helen on 2016/12/1.
 */

import api from '../../../api';

export function editLabel(data) {
    return {
        type: 'EDIT_LABEL',
        payload: {
            promise: api.post('/project/add-lable', {
                data:data
            })
        }
    }
}