/**
 * Created by zhaojp on 2016/10/8.
 */
import _ from 'lodash';
import {
    FETCH_TARGET_PROJECT_PENDING,
    FETCH_TARGET_PROJECT_SUCCESS,
    FETCH_TARGET_PROJECT_ERROR,

    FETCH_DATA_PENDING,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_ERROR,

    FETCH_ISSUES_DATA_PENDING,
    FETCH_ISSUES_DATA_SUCCESS,
    FETCH_ISSUES_DATA_ERROR
} from '../constants/action-types';


const initialState = {

};

export function fetchMergeData(state = initialState, action = {}) {

    switch (action.type) {
        //获取source project信息
        case FETCH_DATA_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case FETCH_DATA_SUCCESS:
            return Object.assign({}, initialState, {milestones: action.payload.milestones,members:action.payload.members,labels:action.payload.labels,fetchErrors: null,loading: false});

        case FETCH_DATA_ERROR:
            return Object.assign({}, initialState, {milestones:null,members:null,labels:null, fetchErrors: action.payload.errorMsg,loading: false});

        default:
            return state;

    }
}

export function fetchMergeBranchData(state = initialState, action = {}) {
        switch (action.type){
            //获取target project 信息
            case FETCH_TARGET_PROJECT_PENDING:
                return Object.assign({}, initialState, {loading: true, isMR:true});

            case FETCH_TARGET_PROJECT_SUCCESS:
                let isMR = false;
                if(action.payload.length > 1){
                    isMR = true;
                }
                console.log('mergeBranch: action.payload', action.payload)
                return Object.assign({}, initialState, {mergeBranch: action.payload,fetchErrors: null, isMR:isMR,loading: false});

            case FETCH_TARGET_PROJECT_ERROR:
                return Object.assign({}, initialState, {mergeBranch:null, fetchErrors: action.payload.errorMsg,loading: false});

            default:
                return state;
        }
}

export function fetchIssuesData(state = initialState, action = {}) {
    switch (action.type) {
        //获取里程碑详细信息
        case FETCH_ISSUES_DATA_PENDING:
            return Object.assign({}, initialState, {loading: true,Issues:[], loadIssuesErrors:null});

        case FETCH_ISSUES_DATA_SUCCESS:
            return Object.assign({}, initialState, {Issues: action.payload, loading: false, loadIssuesErrors:null, loading: false });

        case FETCH_ISSUES_DATA_ERROR:
            return {state, loadIssuesErrors: action.payload.errorMsg, loading: false, Issues:[], loading: false };

        default:
            return state;
    }
}