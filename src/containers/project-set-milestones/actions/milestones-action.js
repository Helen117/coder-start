/**
 * Created by zhaojp on 2016/9/14.
 */
import {ACQUIRE_MILESTONES,
    ACQUIRE_MILESTONES_DETAIL,
    PUT_MILESTONES_PROID,
    ACQUIRE_PROJECT_SET_MILESTONES} from '../constants/milestones-action-types';
import api from '../../../api';

export function getProjectSetMilestones(set_id, page, timeLineData) {
    var path ='/project/milestones';
    return {
        type: ACQUIRE_MILESTONES,
        meta:{timeLineData},
        payload: {
            promise: api.post(path, {
                params: {
                    set_id:set_id,
                    page:page
                }
            })
        }
    }
}

export function getProjectMilestones(projectId,page,timeLineData) {
    var path ='/milestone/project';
    return {
        type: ACQUIRE_MILESTONES,
        meta:{timeLineData},
        payload: {
            promise: api.post(path, {
                params: {
                    projectId:projectId,
                    page:page
                }
            })
        }
    }
}

export function getMilestonesIssues(milestonesId,projectId) {
    var path ='/milestone/issues'
    return {
        type: ACQUIRE_MILESTONES_DETAIL,
        payload: {
            promise: api.post(path, {
                params: {
                    milestoneId:milestonesId,
                    projectId:projectId
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