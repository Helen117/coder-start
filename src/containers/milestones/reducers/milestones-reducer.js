/**
 * Created by zhaojp on 2016/9/14.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES_SUCCESS,
    ACQUIRE_MILESTONES_ERROR,
    ACQUIRE_MILESTONES_DETAIL_SUCCESS,
    ACQUIRE_MILESTONES_DETAIL_ERROR
} from '../constants/milestones-action-types';

const initialState = {
    items: [],
};

export default function milestones(state = initialState, action = {}) {
    console.log('action.type:',action.type);
    switch (action.type) {
        //获取里程碑
        case ACQUIRE_MILESTONES_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload});

        case ACQUIRE_MILESTONES_ERROR:
            console.log("acquire milestones error!");
            return state;

        //获取里程碑详细信息
        case ACQUIRE_MILESTONES_DETAIL_SUCCESS:
            console.log('reducer里获取里程碑详细的数据为',action.payload);
            return Object.assign({}, initialState, {milestoneDetail: action.payload});

        case ACQUIRE_MILESTONES_DETAIL_ERROR:
            console.log("acquire milestones detail error!");
            return state;

        default:
            return state;
    }
}
