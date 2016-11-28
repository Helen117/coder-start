/**
 * Created by zhaojp on 2016/11/23.
 */
import _ from 'lodash';
import {
    ACQUIRE_PERFORMANCE_MSG_PENDING,
    ACQUIRE_PERFORMANCE_MSG_SUCCESS,
    ACQUIRE_PERFORMANCE_MSG_ERROR,

   ACQUIRE_MY_ISSUE_LIST_PENDING,
   ACQUIRE_MY_ISSUE_LIST_SUCCESS,
   ACQUIRE_MY_ISSUE_LIST_ERROR,
    
} from '../constants/home-action-types';

const initialState = {

};

export function acqPerformanceMsg(state = initialState, action = {}) {

    switch (action.type) {
        case ACQUIRE_PERFORMANCE_MSG_PENDING:
            return Object.assign({}, initialState, {loading:true});

        case ACQUIRE_PERFORMANCE_MSG_SUCCESS:
            return Object.assign({}, initialState, {performanceMsg: action.payload,loading:false});

        case ACQUIRE_PERFORMANCE_MSG_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
            };

        default:
            return state;
    }
}


export function acqMyIssueList(state = initialState, action = {}) {

    switch (action.type) {
        case ACQUIRE_MY_ISSUE_LIST_PENDING:
            return Object.assign({}, initialState, {loading:true});

        case ACQUIRE_MY_ISSUE_LIST_SUCCESS:
            return Object.assign({}, initialState, {acqMyIssueList: action.payload, loading:false});

        case ACQUIRE_MY_ISSUE_LIST_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
            };

        default:
            return state;
    }
}