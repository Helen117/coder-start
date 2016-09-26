/**
 * Created by zhaojp on 2016/9/21.
 */
import api from '../../../api';
import {CREATE_MILESTONES} from '../constants/create-milestones-action-types';

export function createMilestone(milestoneData) {
    var path = '/milestone/create';
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