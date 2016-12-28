/**
 * Created by helen on 2016/11/22.
 */
import api from '../../../api';
export function addRequest(message) {
    return {
        type: 'ADD_DEMAND',
        payload: {
            promise: api.post('/project/add-demand', {
                data: message
            })
        }
    }
}

export function editRequest(message) {
    return {
        type: 'EDIT_DEMAND',
        payload: {
            promise: api.post('/project/update-demand', {
                data: message
            })
        }
    }
}


export function getRequestInfo(page, queryCondition) {
    console.log('request查询条件',page, queryCondition);

    queryCondition.page = page;
    return {
        type: 'FETCH_REQUIREMENT_INFO',
        payload: {
            promise: api.post('/project/list-demand', {
                data: queryCondition
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

export function deleteRequestInfo(demand_id,userId) {
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

export function getMilestoneByName(sets_id,milestone_name) {
    return {
        type: 'GET_MILESTONE_BY_NAME',
        payload: {
            promise: api.post('/project/list-milestone-forname', {
                params: {
                    sets_id: sets_id,
                    milestone_name: milestone_name
                }
            })
        }
    }
}

export function requestQueryCondition(page,queryCondition){
    return {
        type: 'REQUEST_QUERY_CONDITION',
        page: page,
        queryCondition: queryCondition,
    }
}


export function getTesterWorkload(user_id,due_date) {
    return {
        type: 'GET_TESTER_WORKLOAD',
        payload: {
            promise: api.post('/project/task-num', {
                params: {
                    user_id: user_id,
                    due_date:due_date,
                }
            })
        }
    }
}


export function getDeveloperWorkload(user_id,due_date) {
    return {
        type: 'GET_DEVELOPER_WORKLOAD',
        payload: {
            promise: api.post('/project/task-num', {
                params: {
                    user_id: user_id,
                    due_date:due_date,
                }
            })
        }
    }
}


