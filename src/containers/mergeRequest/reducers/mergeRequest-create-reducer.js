/**
 * Created by zhaojp on 2016/10/10.
 */
/**
 * Created by zhaojp on 2016/9/21.
 */
/**
 * Created by zhaojp on 2016/10/10.
 */
/**
 * Created by zhaojp on 2016/9/21.
 */
import _ from 'lodash';
import {
    CREATE_MR_PENDING,
    CREATE_MR_SUCCESS,
    CREATE_MR_ERROR,
    
    REVERT_MR_PENDING,
    REVERT_MR_SUCCESS,
    REVERT_MR_ERROR,
} from '../constants/action-types';

const initialState = {
    result: null,
    loading:false,
    disabled:false,
    errors:null
};

export  function createMr(state = initialState, action = {}) {

    switch (action.type) {

        case CREATE_MR_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case CREATE_MR_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});

        case CREATE_MR_ERROR:
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

export  function revertMr(state = initialState, action = {}) {

    switch (action.type) {

        case REVERT_MR_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case REVERT_MR_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});

        case REVERT_MR_ERROR:
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

