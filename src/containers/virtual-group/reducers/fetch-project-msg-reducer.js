/**
 * Created by zhaojp on 2016/10/24.
 */
import _ from 'lodash';
import {
    FETCH_PROJECT_MSG_SUCCESS,
    FETCH_PROJECT_MSG_PENDING,
    FETCH_PROJECT_MSG_ERROR,
} from '../constants/virtual-group-action-types';

const initialState = {
};

export default function fetchProMsg(state = initialState, action = {}) {

    switch (action.type) {

        case FETCH_PROJECT_MSG_PENDING:
            return Object.assign({}, initialState, {loading: true, items:[], errMessage:null});

        case FETCH_PROJECT_MSG_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload, loading: false, errMessage:null});

        case FETCH_PROJECT_MSG_ERROR:
            return {state, errMessage: action.payload.errorMsg, items: [], loading: false};

        default:
            return state;
    }
}