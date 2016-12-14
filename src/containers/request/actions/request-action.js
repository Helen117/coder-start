/**
 * Created by helen on 2016/11/22.
 */
import api from '../../../api';
export function addDemand(message) {
    return {
        type: 'ADD_DEMAND',
        payload: {
            promise: api.post('/project/add-demand', {
                data: message
            })
        }
    }
}

export function editDemand(message) {
    return {
        type: 'EDIT_DEMAND',
        payload: {
            promise: api.post('/project/update-demand', {
                data: message
            })
        }
    }
}


export function getDemandInfo(setId) {
    return {
        type: 'FETCH_REQUIREMENT_INFO',
        payload: {
            promise: api.post('/project/list-demand', {
                params: {
                    sets_id: setId
                }
            })
        }
    }
}

export function getLabelInfo() {
    return {
        type: 'FETCH_LABEL_INFO',
        payload: {
            promise: api.post('/project/labels')
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

export function deleteDemandInfo(demand_id,userId) {
    return {
        type: 'DELETE_REQUIREMENT_INFO',
        payload: {
            promise: api.post('/project/delete-demand', {
                params: {
                    demand_id: demand_id,
                    user_id: userId
                }
            })
        }
    }
}


export function getCurrentMilestone(sets_id,due_date) {
    return {
        type: 'GET_CURRENT_MILESTONE',
        payload: {
            promise: api.post('/project/current-milestone', {
                params: {
                    sets_id: sets_id,
                    due_date: due_date
                }
            })
        }
    }
}

