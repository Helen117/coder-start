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


export function getDeveloperInfo(projectSetId) {
    return {
        type: 'FETCH_DEVELOPER_INFO',
        payload: {
            promise: api.post('/request/add', {
                params: {
                    projectSetId: projectSetId
                }
            })
        }
    }
}


export function getTesterInfo(projectSetId) {
    return {
        type: 'FETCH_TESTER_INFO',
        payload: {
            promise: api.post('/request/add', {
                params: {
                    projectSetId: projectSetId
                }
            })
        }
    }
}
