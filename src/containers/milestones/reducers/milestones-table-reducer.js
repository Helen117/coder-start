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
    milestoneIssues: [],
    loading: false,
    loadIssuesErrors:null
};

export default function getMilestonesIssues(state = initialState, action = {}) {
    switch (action.type) {
        //获取里程碑详细信息
        case ACQUIRE_MILESTONES_DETAIL_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case ACQUIRE_MILESTONES_DETAIL_SUCCESS:
            return Object.assign({}, initialState, {milestoneIssues: action.payload});

        case ACQUIRE_MILESTONES_DETAIL_ERROR:
            return {state, errMessage: action.payload.errorMsg};

        default:
            return state;
    }
}
