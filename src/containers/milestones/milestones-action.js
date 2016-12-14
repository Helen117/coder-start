/**
 * Created by zhaojp on 2016/9/21.
 */
import api from '../../api';
import {CREATE_MILESTONES,
    UPDATE_MILESTONES,
    ACQUIRE_MILESTONES,
    ACQUIRE_MILESTONES_ISSUES,
    PUT_MILESTONES_PROID} from './milestones-action-types'

export function createMilestone(milestoneData) {
    var path = '/project/create-milestone';
    return {
        type: CREATE_MILESTONES,
        payload: {
            promise: api.post(path, {
                data: milestoneData
            })
        }
    }
}

export function updateMilestone(milestoneData) {
    var path = '/project/update-milestone';
    return {
        type: UPDATE_MILESTONES,
        payload: {
            promise: api.post(path, {
                data: milestoneData,

            })
        }
    }
}

export function getProjectSetMilestones(set_id, date,mode) {
    var path ='/project/milestones';
    return {
        type: ACQUIRE_MILESTONES,
        payload: {
            promise: api.post(path, {
                params: {
                    id: set_id,
                    date: date,
                    type: mode
                }
            })
        }
    }
}


export function getMilestonesIssues(milestonesId,setId,projectId,state,due_end) {
    //console.log('查看问题',milestonesId,setId,projectId,state,due_end)
    var path ='/project/issues'
    return {
        type: ACQUIRE_MILESTONES_ISSUES,
        payload: {
            promise: api.post(path, {
                data:{
                    sets_id : setId,
                    project_id: projectId,
                    milestone_id: milestonesId,
                    state: state,
                    due_end: due_end
                }
            })
        }
    }
}

export function putProIdToState(projectId) {
    return {
        type: PUT_MILESTONES_PROID,
        data: projectId
    }
}