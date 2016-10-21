/**
 * Created by zhaojp on 2016/10/21.
 */
/**
 * Created by zhaojp on 2016/10/8.
 */
import _ from 'lodash';
import {
    FETCH_MR_LIST_PENDING,
    FETCH_MR_LIST_SUCCESS,
    FETCH_MR_LIST_ERROR,
} from '../constants/action-types';


const initialState = {
    fetchErrors: null,
    loading: false,
    mrList: null
};

export default function fetchMrList(state = initialState, action = {}) {

    switch (action.type) {
        //获取source project信息
        case FETCH_MR_LIST_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case FETCH_MR_LIST_SUCCESS:
            return Object.assign({}, initialState, {mrList: action.payload, fetchErrors: null, loading:false});

        case FETCH_MR_LIST_ERROR:
            return Object.assign({}, initialState, { fetchErrors: action.payload.errorMsg, loading:false});

        default:
            return state;

    }
}