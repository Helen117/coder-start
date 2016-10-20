/**
 * Created by zhaojp on 2016/9/14.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES,
    ACQUIRE_MILESTONES_SUCCESS,
    ACQUIRE_MILESTONES_PENDING,
    ACQUIRE_MILESTONES_ERROR,
} from '../constants/milestones-action-types';

const initialState = {
    items: [],
    loading:false,
    errMessage:null,
    acquireData:false
};

export default function milestones(state = initialState, action = {}) {
    switch (action.type) {

        case ACQUIRE_MILESTONES_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case ACQUIRE_MILESTONES_SUCCESS:
            const timeLineData = action.meta;
            for(let i=0; i<action.payload.length; i++) {
                timeLineData.push(action.payload[i]);
            }
            return Object.assign({}, initialState, {items: action.payload,timeLineData:timeLineData, loading: false,acquireData:true});

        case ACQUIRE_MILESTONES_ERROR:
            return {state, errMessage: action.payload.errorMsg};

        default:
            return state;
    }
}
