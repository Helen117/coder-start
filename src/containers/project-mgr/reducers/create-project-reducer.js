/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import {
    CREATE_PROJECT_PENDING,
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_ERROR
} from '../constants/create-project-types';

const initialState = {
};

export default function createProject(state = initialState, action = {}) {
    switch (action.type) {
        case CREATE_PROJECT_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});
        case CREATE_PROJECT_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,disabled:false});
        case CREATE_PROJECT_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false,
            };
        default:
            return state;
    }
}
