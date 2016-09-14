/**
 * Created by zhaojp on 2016/9/14.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES_SUCCESS,
    ACQUIRE_MILESTONES_ERROR,
} from '../constants/milestones-action-types';

const initialState = {
    items: [],
};

export default function milestones(state = initialState, action = {}) {
    switch (action.type) {
        case ACQUIRE_MILESTONES_SUCCESS:
            console.log('reducer里获取里程碑的数据为',action.payload);
            return Object.assign({}, initialState, {items: action.payload});

        case ACQUIRE_MILESTONES_ERROR:
            console,log("acquire milestones error!");
            return ;

        default:
            return state;
    }
}
