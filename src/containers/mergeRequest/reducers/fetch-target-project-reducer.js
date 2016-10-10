/**
 * Created by zhaojp on 2016/10/10.
 */
import _ from 'lodash';
import {
    FETCH_TARGET_PROJECT_PENDING,
    FETCH_TARGET_PROJECT_SUCCESS,
    FETCH_TARGET_PROJECT_ERROR,
} from '../constants/action-types';


const initialState = {

};

export default function fetchMergeData(state = initialState, action = {}) {

    switch (action.type) {
        //获取target project 信息
        case FETCH_TARGET_PROJECT_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case FETCH_TARGET_PROJECT_SUCCESS:
            return Object.assign({}, initialState, {targetProData: action.payload,fetchErrors: null});

        case FETCH_TARGET_PROJECT_ERROR:
            return Object.assign({}, initialState, {targetProData:null, fetchErrors: action.payload.errorMsg});

        default:
            return state;
    }
}