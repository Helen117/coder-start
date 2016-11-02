/**
 * Created by zhaojp on 2016/9/21.
 */
import _ from 'lodash';
import {
    CREATE_MILESTONES_PENDING,
    CREATE_MILESTONES_SUCCESS,
    CREATE_MILESTONES_ERROR,

    UPDATE_MILESTONES_PENDING,
    UPDATE_MILESTONES_SUCCESS,
    UPDATE_MILESTONES_ERROR,
} from '../constants/create-milestones-action-types';

const initialState = {

};

export function createMilestones(state = initialState, action = {}) {

    switch (action.type) {
        case CREATE_MILESTONES_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case CREATE_MILESTONES_SUCCESS:
            //console.log('action.payload',action.payload);
            return Object.assign({}, initialState, {items: action.payload,loading:false,disabled:false});

        case CREATE_MILESTONES_ERROR:
            //console.log('errorMsg',action.payload.errorMsg);
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false
            };

        default:
            return state;
    }
}


export function updateMilestones(state = initialState, action = {}) {

    switch (action.type) {
        case UPDATE_MILESTONES_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case UPDATE_MILESTONES_SUCCESS:
            //console.log('action.payload',action.payload);
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});

        case UPDATE_MILESTONES_ERROR:
            //console.log('errorMsg',action.payload.errorMsg);
            return {
                ...state,
                errorMsg: action.payload.errorMsg,
                loading:false,
                disabled:false
            };

        default:
            return state;
    }
}