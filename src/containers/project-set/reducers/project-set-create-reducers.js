/**
 * Created by zhaojp on 2016/10/24.
 */
import _ from 'lodash';
import {
    CREATE_PROJECT_SET_PENDING,
    CREATE_PROJECT_SET_SUCCESS,
    CREATE_PROJECT_SET_ERROR,
} from '../constants/project-set-action-types';

const initialState = {

};

export default function createProjectSet(state = initialState, action = {}) {

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