/**
 * Created by zhaojp on 2016/10/25.
 */
import _ from 'lodash';
import {
    FETCH_VIRTUAL_GROUP_TREE_SUCCESS,
    FETCH_VIRTUAL_GROUP_TREE_PENDING,
    FETCH_VIRTUAL_GROUP_TREE_ERROR,
} from '../constants/virtual-group-action-types';
const initialState = {
};

export default function fetchVirtualGroupTree(state = initialState, action = {}) {

    switch (action.type) {

        case FETCH_VIRTUAL_GROUP_TREE_PENDING:
            return Object.assign({}, initialState, {loading: true, items:[], errMessage:null});

        case FETCH_VIRTUAL_GROUP_TREE_SUCCESS:
            return Object.assign({}, initialState, {virtualGroupTree: action.payload, loading: false, errMessage:null});

        case FETCH_VIRTUAL_GROUP_TREE_ERROR:
            return {state, errMessage: action.payload.errorMsg, items: [], loading: false};

        default:
            return state;
    }
}