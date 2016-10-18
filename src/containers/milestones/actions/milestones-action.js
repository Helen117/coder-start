/**
 * Created by zhaojp on 2016/9/14.
 */
import {ACQUIRE_MILESTONES,ACQUIRE_MILESTONES_DETAIL} from '../constants/milestones-action-types';
import api from '../../../api';

export function getMilestones(projectId,page,timeLineData) {
    //var path='/milestones';
    var path ='/milestone/project';
    return {
        type: ACQUIRE_MILESTONES,
        meta:timeLineData,
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
    //var path ='/milestoneDetail'
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