/**
 * Created by helen on 2016/11/22.
 */
import api from '../../../api';
export function editDemand(message) {
    return {
        type: 'EDIT_DEMAND',
        payload: {
            promise: api.post('/request/edit', {
                data: message
            })
        }
    }
}

export function getDemandInfo(projectSetId) {
    return {
        type: 'FETCH_REQUIREMENT_INFO',
        payload: {
            promise: api.post('/request/add', {
                params: {
                    projectSetId: projectSetId
                }
            })
        }
    }
}

export function getBusinessInfo(projectSetId) {
    return {
        type: 'FETCH_BUSINESS_INFO',
        payload: {
            promise: api.post('/request/add', {
                params: {
                    projectSetId: projectSetId
                }
            })
        }
    }
}


export function getDeveloperInfo(id,type,role) {
    return {
        type: 'FETCH_DEVELOPER_INFO',
        payload: {
            promise: api.post('/project/assign-list', {
                params: {
                    id: id,
                    type:type,
                    role:role
                }
            })
        }
    }
}


export function getTesterInfo(id,type,role) {
    return {
        type: 'FETCH_TESTER_INFO',
        payload: {
            promise: api.post('/project/assign-list', {
                params: {
                    id: id,
                    type:type,
                    role:role
                }
            })
        }
    }
}
