/**
 * Created by zhaojp on 2016/9/14.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES_SUCCESS,
    ACQUIRE_MILESTONES_PENDING,
    ACQUIRE_MILESTONES_ERROR,
    PUT_MILESTONES_PROID,
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

            let temp = 0;
            for (let i = timeLineData.length - 1; i > 0; --i) {
                for (let j = 0; j < i; ++j)
                {
                    if (timeLineData[j + 1].due_date < timeLineData[j].due_date)
                    {
                        temp = timeLineData[j];
                        timeLineData[j] = timeLineData[j + 1];
                        timeLineData[j + 1] = temp;
                    }
                }
            }
            return Object.assign({}, initialState, {items: action.payload, timeLineData:timeLineData, loading: false, acquireData:true, errMessage:null});

        case ACQUIRE_MILESTONES_ERROR:
            return {state, errMessage: action.payload.errorMsg,items: [], loading: false, acquireData:false};

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
