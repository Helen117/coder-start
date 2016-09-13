import api from '../../../api';
import {UID_NOT_FOUND, FETCH_PROFILE,LOGIN,LOGOUT} from '../constants/login-action-types';


export function fetchProfile(uid) {
    if (uid === undefined) {
        return {type: UID_NOT_FOUND};
    }
    return {
        type: FETCH_PROFILE,
        payload: {
          promise: api.get('/user/'+uid)
        }
    }
}

export function login(user, password) {
  return {
      type: LOGIN,
      payload: {
        promise: api.post('/login', {
          data: {
            username: user,
            password: password,
            type: '0'
          }
        })
      }
  }
}

export function logout() {
    return {
        type: LOGOUT
    }
}
