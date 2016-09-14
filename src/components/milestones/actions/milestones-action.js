/**
 * Created by zhaojp on 2016/9/14.
 */
import {ACQUIRE_MILESTONES} from '../constants/milestones-action-types';
import api from '../../../api';

export function getMilestones(projectId) {
    return {
        type: ACQUIRE_MILESTONES,
        payload: {
            promise: api.get('/milestones', {
                data: {
                    projectId:projectId
                }
            })
        }
    }
}