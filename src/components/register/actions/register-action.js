/**
 * Created by helen on 2016/9/14.
 */
import api from '../../../api';
export function register(user, password) {
    return {
        type: 'REGISTER',
        payload: {
            promise: api.post('/register', {
                data: {
                    username: user,
                    password: password,
                    type: '0'
                }
            })
        }
    }
}