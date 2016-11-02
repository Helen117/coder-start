/**
 * Created by zhaojp on 2016/9/21.
 */
import api from '../../../api';
import {CREATE_MILESTONES,UPDATE_MILESTONES} from '../constants/create-milestones-action-types';

export function createMilestone(milestoneData) {
    var path = '/project/create-milestone';
    //console.log('milestoneData',milestoneData);
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
    console.log('milestoneData',milestoneData);
    return {
        type: UPDATE_MILESTONES,
        payload: {
            promise: api.post(path, {
                data: milestoneData
            })
        }
    }
}