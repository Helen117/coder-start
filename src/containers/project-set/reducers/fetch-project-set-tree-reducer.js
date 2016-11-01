/**
 * Created by zhaojp on 2016/10/25.
 */
import _ from 'lodash';
import {
    FETCH_PROJECT_SET_TREE_SUCCESS,
    FETCH_PROJECT_SET_TREE_PENDING,
    FETCH_PROJECT_SET_TREE_ERROR,
} from '../constants/project-set-action-types';
const initialState = {
};

export default function fetchProjectSetTree(state = initialState, action = {}) {

    switch (action.type) {

        case FETCH_PROJECT_SET_TREE_PENDING:
            return Object.assign({}, initialState, {loading: true, items:[], errMessage:null});

        case FETCH_PROJECT_SET_TREE_SUCCESS:
            return Object.assign({}, initialState, {projectSetTree: action.payload, loading: false, errMessage:null});

        case FETCH_PROJECT_SET_TREE_ERROR:
            return {state, errMessage: action.payload.errorMsg, items: [], loading: false};

        default:
            return state;
    }
}