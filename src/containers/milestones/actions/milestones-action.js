/**
 * Created by zhaojp on 2016/9/14.
 */
import {ACQUIRE_MILESTONES,
    ACQUIRE_MILESTONES_ISSUES,
    PUT_MILESTONES_PROID} from '../constants/milestones-action-types';
import api from '../../../api';

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


export function getMilestonesIssues(milestonesId,projectId, state) {
    console.log('查看问题',milestonesId,projectId, state)
    var path ='/project/project-issues'
    return {
        type: ACQUIRE_MILESTONES_ISSUES,
        payload: {
            promise: api.post(path, {
                params: {
                    milestoneId: milestonesId,
                    projectId: projectId,
                    state: state
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