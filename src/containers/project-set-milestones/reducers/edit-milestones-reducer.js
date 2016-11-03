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

    CHECK_DUE_DATE_PENDING,
    CHECK_DUE_DATE_SUCCESS,
    CHECK_DUE_DATE_ERROR
} from '../constants/edit-milestones-action-types';

const initialState = {

};

export function createMilestones(state = initialState, action = {}) {

    switch (action.type) {
        case CREATE_MILESTONES_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case CREATE_MILESTONES_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload,loading:false,disabled:false});

        case CREATE_MILESTONES_ERROR:
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
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});

        case UPDATE_MILESTONES_ERROR:
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

export function checkDueDate(state = initialState, action = {}) {

    switch (action.type) {
        case CHECK_DUE_DATE_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case CHECK_DUE_DATE_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload, loading:false,disabled:false});

        case CHECK_DUE_DATE_ERROR:
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