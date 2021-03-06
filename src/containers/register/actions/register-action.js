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


export function getAllUser() {
    return {
        type: 'GET_ALL_USER',
        payload: {
            promise: api.post('/user/all')
        }
    }
}


export function getLeader() {
    return {
        type: 'GET_LEADER',
        payload: {
            promise: api.post('/user/leader-list')
        }
    }
}

export function getRole() {
    return {
        type: 'GET_ROLE',
        payload: {
            promise: api.post('/user/role-list')
        }
    }
}


export function getOrganization() {
    return {
        type: 'GET_ORGANIZATION',
        payload: {
            promise: api.post('/user/organization-list')
        }
    }
}