/**
 * Created by zhaojp on 2016/10/24.
 */
import _ from 'lodash';
import {
    CREATE_PROJECT_SET_PENDING,
    CREATE_PROJECT_SET_SUCCESS,
    CREATE_PROJECT_SET_ERROR,

    UPDATE_PROJECT_SET_PENDING,
    UPDATE_PROJECT_SET_SUCCESS,
    UPDATE_PROJECT_SET_ERROR,

    DELETE_PROJECT_SET_PENDING,
    DELETE_PROJECT_SET_SUCCESS,
    DELETE_PROJECT_SET_ERROR
} from '../constants/project-set-action-types';

const initialState = {
    loading:false
};

export function createProjectSet(state = initialState, action = {}) {

    switch (action.type) {
        case CREATE_PROJECT_SET_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case CREATE_PROJECT_SET_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload,loading:false,disabled:false});

        case CREATE_PROJECT_SET_ERROR:
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


export function updateProjectSet(state = initialState, action = {}) {

    switch (action.type) {
        case UPDATE_PROJECT_SET_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case UPDATE_PROJECT_SET_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload,loading:false,disabled:false});

        case UPDATE_PROJECT_SET_ERROR:
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


export function deleteProjectSet(state = initialState, action = {}) {

    switch (action.type) {
        case DELETE_PROJECT_SET_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case DELETE_PROJECT_SET_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});

        case DELETE_PROJECT_SET_ERROR:
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