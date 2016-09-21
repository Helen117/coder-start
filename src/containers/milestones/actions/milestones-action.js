/**
 * Created by zhaojp on 2016/9/14.
 */
import {ACQUIRE_MILESTONES,ACQUIRE_MILESTONES_DETAIL} from '../constants/milestones-action-types';
import api from '../../../api';

export function getMilestones(projectId) {
    return {
        type: ACQUIRE_MILESTONES,
        payload: {
            promise: api.post('/milestones', {
                data: {
                    projectId:projectId
                }
            })
        }
    }
}

export function getMilestonesDetail(milestonesId) {
    return {
        type: ACQUIRE_MILESTONES_DETAIL,
        payload: {
            promise: api.post('/milestoneDetail', {
                data: {
                    milestonesId:milestonesId
                }
            })
        }
    }
}