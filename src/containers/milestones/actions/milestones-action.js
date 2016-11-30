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


export function getMilestonesIssues(milestonesId,setId,projectId,state) {
    console.log('查看问题',milestonesId,setId,projectId,state)
    var path ='/project/issues'
    return {
        type: ACQUIRE_MILESTONES_ISSUES,
        payload: {
            promise: api.post(path, {
                data:{
                    set_id : setId,
                    project_id: projectId,
                    milestone_id: milestonesId,
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