/**
 * Created by zhaojp on 2016/10/11.
 */
import _ from 'lodash';
import {
    FETCH_BRANCHES_PENDING,
    FETCH_BRANCHES_SUCCESS,
    FETCH_BRANCHES_ERROR,

} from '../constants/action-types';


const initialState = {

};

export default function fetchBranches(state = initialState, action = {}) {

    switch (action.type){
        //获取target project 信息
        case FETCH_BRANCHES_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case FETCH_BRANCHES_SUCCESS:
            console.log('action.payload2222',action.payload);
            return Object.assign({}, initialState, {branchesData: action.payload,fetchErrors: null});

        case FETCH_BRANCHES_ERROR:
            return Object.assign({}, initialState, {branchesData:null, fetchErrors: action.payload.errorMsg});

        default:
            return state;
    }
}