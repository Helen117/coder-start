/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/18
 */
import {
    GET_GROUP_TREE_PENDING,
    GET_GROUP_TREE_SUCCESS,
    GET_GROUP_TREE_ERROR,
    SET_SELECT_NODE
} from '../constants/group-tree-types';
import {LOGOUT} from '../../login/constants/login-action-types';

const initialState = {
   treeData: []
};

export default function getGroupTree(state = initialState, action = {}) {
    switch (action.type) {
        case GET_GROUP_TREE_PENDING:
            return Object.assign({}, initialState, {loading: true});
        case GET_GROUP_TREE_SUCCESS:
            return Object.assign({}, initialState, {loading: false, treeData: action.payload});
        case GET_GROUP_TREE_ERROR:
            return {
                ...state,
                errors: action.payload.message, loading: false
            };
        case SET_SELECT_NODE:
            return {
                ...state,
                selectNode: action.meta
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}

