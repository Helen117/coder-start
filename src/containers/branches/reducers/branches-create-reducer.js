/**
 * Created by zhaojp on 2016/10/11.
 */
import _ from 'lodash';
import {
    CREATE_BRANCHES_PENDING,
    CREATE_BRANCHES_SUCCESS,
    CREATE_BRANCHES_ERROR,
} from '../constants/action-types';

const initialState = {
    result: null,
    loading:false,
    disabled:false,
    errors:null
};

export default function createBranch(state = initialState, action = {}) {

    switch (action.type) {

        case CREATE_BRANCHES_PENDING:
            return Object.assign({}, initialState, {result: null,loading:true,disabled:true});

        case CREATE_BRANCHES_SUCCESS:

            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});

        case CREATE_BRANCHES_ERROR:
            return {
                ...state,
                result: null,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false
            };

        default:
            return state;
    }
}
