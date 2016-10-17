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
    FETCH_DATA_ERROR
} from '../constants/action-types';


const initialState = {

};

export function fetchMergeData(state = initialState, action = {}) {

    switch (action.type) {
        //获取source project信息
        case FETCH_DATA_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case FETCH_DATA_SUCCESS:
            return Object.assign({}, initialState, {milestones: action.payload.milestones,members:action.payload.members,labels:action.payload.labels,fetchErrors: null});

        case FETCH_DATA_ERROR:
            return Object.assign({}, initialState, {milestones:null,members:null,labels:null, fetchErrors: action.payload.errorMsg});

        default:
            return state;

    }
}

export function fetchMergeBranchData(state = initialState, action = {}) {
        switch (action.type){
            //获取target project 信息
            case FETCH_TARGET_PROJECT_PENDING:
                return Object.assign({}, initialState, {loading: true});

            case FETCH_TARGET_PROJECT_SUCCESS:
                return Object.assign({}, initialState, {mergeBranch: action.payload,fetchErrors: null});

            case FETCH_TARGET_PROJECT_ERROR:
                return Object.assign({}, initialState, {mergeBranch:null, fetchErrors: action.payload.errorMsg});

            default:
                return state;
        }
}