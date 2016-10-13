/**
 * Created by zhaojp on 2016/10/8.
 */
import api from '../../../api';
import {MORE_MILESTONES_SUCCESS,MORE_MILESTONES_ERROR} from '../constants/more-milestones-action-type';

export function getMoreMilestonesSuss(data) {
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

export function getMoreMilestones(data) {
    return (dispatch) => {
        if(data){
            dispatch(getMoreMilestonesSuss(data));
        }else{
            dispatch(getMoreMilestonesFail());
        }
    }
}
