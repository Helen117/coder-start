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
    GET_GROUP_TREE_ERROR
} from '../constants/group-tree-types';

const initialState = {
};

export default function getGroupTree(state = initialState, action = {}) {
    switch (action.type) {
        case GET_GROUP_TREE_PENDING:
            return Object.assign({}, initialState, {});
        case GET_GROUP_TREE_SUCCESS:
            return Object.assign({}, initialState, {treeData: action.payload});
        case GET_GROUP_TREE_ERROR:
            return {
                ...state,
                errors: action.payload.message
            };
        default:
            return state;
    }
}
