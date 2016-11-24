/**
 * Created by helen on 2016/11/22.
 */
import api from '../../../api';
export function addRequest(message) {
    return {
        type: 'ADD_REQUEST',
        payload: {
            promise: api.post('/request/add', {
                data: message
            })
        }
    }
}