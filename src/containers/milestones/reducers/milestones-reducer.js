/**
 * Created by zhaojp on 2016/9/14.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES_SUCCESS,
    ACQUIRE_MILESTONES_PENDING,
    ACQUIRE_MILESTONES_ERROR,
    PUT_MILESTONES_PROID,
    PUT_MILESTONES_PROID_SUCCESS,
    PUT_MILESTONES_PROID_ERROR,
} from '../constants/milestones-action-types';

const initialState = {
};

export function milestones(state = initialState, action = {}) {

        switch (action.type) {

        case ACQUIRE_MILESTONES_PENDING:

            return Object.assign({}, initialState, {loading: true, items:[], acquireData:false, errMessage:null});

        case ACQUIRE_MILESTONES_SUCCESS:
            let timeLineData = action.meta.timeLineData;
            for(let i=0; i<action.payload.length; i++) {
                timeLineData.push(action.payload[i]);
            }
            return Object.assign({}, initialState, {items: action.payload, timeLineData:timeLineData, loading: false, acquireData:true, errMessage:null});

        case ACQUIRE_MILESTONES_ERROR:
            let timeLineData2 = action.meta.timeLineData;
            return {state, errMessage: action.payload.errorMsg,items: [], timeLineData:timeLineData2, loading: false, acquireData:false};

        default:
            return state;
    }
}

export function putMilestonesProId(state = initialState, action = {}) {
    switch (action.type) {
        case PUT_MILESTONES_PROID:
            return Object.assign({}, initialState, {milestoneProId: action.data});

        case PUT_MILESTONES_PROID_ERROR:
            return {...state, errors: action.errMessage};

        default:
            return state;
    }
}
