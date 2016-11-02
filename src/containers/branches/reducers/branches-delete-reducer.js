/**
 * Created by zhaojp on 2016/11/1.
 */
import _ from 'lodash';
import {
    DELETE_BRANCHES_PENDING,
    DELETE_BRANCHES_SUCCESS,
    DELETE_BRANCHES_ERROR,
} from '../constants/action-types';

const initialState = {
    result: null,
    loading:false,
    disabled:false,
    errors:null
};

export default function deleteBranch(state = initialState, action = {}) {

    switch (action.type) {
        case DELETE_BRANCHES_PENDING:
            return Object.assign({}, initialState, {result: null,loading:true,disabled:true});

        case DELETE_BRANCHES_SUCCESS:

            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});

        case DELETE_BRANCHES_ERROR:
            return {
                ...state,
                result: null,
                errorMsg: action.payload.errorMsg,
                loading:false,
                disabled:false
            };

        default:
            return state;
    }
}
