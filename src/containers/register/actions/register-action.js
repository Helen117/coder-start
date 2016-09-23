/**
 * Created by helen on 2016/9/14.
 */
import api from '../../../api';
export function register(message) {
    return {
        type: 'REGISTER',
        payload: {
            promise: api.post('/user/add', {
                data: message
            })
        }
    }
}

export function userExists() {
    return {
        type: 'USEREXISTS',
        payload: {
            promise: api.get('/userExists')
        }
    }
}