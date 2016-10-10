/**
 * Created by zhaojp on 2016/10/8.
 */
import api from '../../../api';
import {MORE_MILESTONES_SUCCESS,
    MORE_MILESTONES_ERROR} from '../constants/more-milestones-action-type';

export function getMoreMilestonesSuss(data,moreMilestoneData) {
    for(let i=0; i<moreMilestoneData.length; i++) {
        data.push(moreMilestoneData[i]);
    }
    return {
        type:MORE_MILESTONES_SUCCESS,
        data:data
    }
}

export function getMoreMilestonesFail() {
    return {
        type:MORE_MILESTONES_ERROR,
        errMessage:"无更多数据!"
    }
}

export function getMoreMilestones(data,moreMilestoneData) {
    return (dispatch) => {
        if(moreMilestoneData){

            dispatch(getMoreMilestonesSuss(data,moreMilestoneData));
        }else{
            dispatch(getMoreMilestonesFail());
        }
    }
}
