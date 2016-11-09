/**
 * Created by zhaojp on 2016/9/21.
 */
import api from '../../../api';
import {CREATE_MILESTONES,
    UPDATE_MILESTONES,
    CLOSE_MILESTONES,
    CLOSE_SET_MILESTONES,
    CHECK_DUE_DATE} from '../constants/edit-milestones-action-types';

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

export function checkDueDate(milestoneId,set_id,due_date) {
    var path = '/project/milestone-time-check';
    //console.log('milestoneId,set_id,due_date',milestoneId,set_id,due_date)
    return {
        type: CHECK_DUE_DATE,
        payload: {
            promise: api.post(path, {
                params: {
                    milestone_id: milestoneId,
                    sets_id: set_id,
                    due_date: due_date
                }

            })
        }
    }
}

export function closeSetMilestone(milestone_id,sets_id) {
    var path = '/project/close-milestone';
    return {
        type: CLOSE_SET_MILESTONES,
        payload: {
            promise: api.post(path, {
                params: {
                    milestone_id: milestone_id,
                    sets_id: sets_id
                }
            })
        }
    }
}