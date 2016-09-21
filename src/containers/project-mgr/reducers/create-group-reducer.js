/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import {
    CREATE_GROUP_PENDING,
    CREATE_GROUP_SUCCESS,
    CREATE_GROUP_ERROR
} from '../constants/create-group-types';

const initialState = {
};

export default function createGroup(state = initialState, action = {}) {
    switch (action.type) {
        case CREATE_GROUP_PENDING:
            return Object.assign({}, initialState, {});
        case CREATE_GROUP_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload});
        case CREATE_GROUP_ERROR:
            return {
                ...state,
                errors: action.payload.message
            };
        default:
            return state;
    }
}
