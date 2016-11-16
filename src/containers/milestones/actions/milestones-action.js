/**
 * Created by zhaojp on 2016/9/14.
 */
import {ACQUIRE_MILESTONES,
    ACQUIRE_MILESTONES_DETAIL,
    PUT_MILESTONES_PROID} from '../constants/milestones-action-types';
import api from '../../../api';

export function getProjectSetMilestones(set_id, date) {
    var path ='/project/milestones';
    return {
        type: ACQUIRE_MILESTONES,
        payload: {
            promise: api.post(path, {
                params: {
                    set_id: set_id,
                    date: date
                }
            })
        }
    }
}

export function getProjectMilestones(projectId,date) {
    var path ='/milestone/project';
    return {
        type: ACQUIRE_MILESTONES,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId:projectId,
                    date:date
                }
            })
        }
    }
}

export function getMilestonesIssues(milestonesId,projectId) {
    var path ='/project/project-issues'
    return {
        type: ACQUIRE_MILESTONES_DETAIL,
        payload: {
            promise: api.post(path, {
                params: {
                    milestoneId: milestonesId,
                    projectId: projectId
                }
            })
        }
    }
}

export function getSetMilestonesIssues(milestonesId,projectId) {
    var path ='/project/sets-issues'
    return {
        type: ACQUIRE_MILESTONES_DETAIL,
        payload: {
            promise: api.post(path, {
                params: {
                    milestoneId: milestonesId,
                    projectId: projectId
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