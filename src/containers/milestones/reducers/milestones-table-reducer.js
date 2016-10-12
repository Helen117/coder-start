/**
 * Created by zhaojp on 2016/9/27.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES_DETAIL_PENDING,
    ACQUIRE_MILESTONES_DETAIL_SUCCESS,
    ACQUIRE_MILESTONES_DETAIL_ERROR
} from '../constants/milestones-action-types';

const initialState = {
    milestoneDetail: [],
};

export default function milestonesDetail(state = initialState, action = {}) {
    //console.log('action.type:',action.type);
    switch (action.type) {
        //获取里程碑详细信息
        case ACQUIRE_MILESTONES_DETAIL_PENDING:
            return Object.assign({}, initialState, {loading: true});
        case ACQUIRE_MILESTONES_DETAIL_SUCCESS:
            //console.log('reducer里获取里程碑详细的数据为',action.payload);
            return Object.assign({}, initialState, {milestoneDetail: action.payload});

        case ACQUIRE_MILESTONES_DETAIL_ERROR:
            //console.log("acquire milestones detail error!");
            return {state, loginErrors: action.payload.errorMsg};

        default:
            return state;
    }
}
