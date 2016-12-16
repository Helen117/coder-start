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
            return Object.assign({}, initialState, {myIssueList: action.payload, loading:false});

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

export function getNotifyItems(state = {}, action = {}) {
    switch (action.type) {
        case 'NOTIFY_ITEM_PENDING':
            return Object.assign({}, {pending:true});
        case 'NOTIFY_ITEM_SUCCESS':
            return Object.assign({}, {notifyItems: action.payload,errors: null});
        case 'NOTIFY_ITEM_ERROR':
            return Object.assign({},{notifyItems:null,errors: action.payload.errorMsg});
        default:
            return state;
    }
}