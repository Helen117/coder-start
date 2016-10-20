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
    loading:false,
    branchesData:null,
    fetchErrors:null,
};

export default function fetchBranches(state = initialState, action = {}) {

    switch (action.type){
        //获取target project 信息
        case FETCH_BRANCHES_PENDING:
            return Object.assign({}, initialState, {loading: true});

        case FETCH_BRANCHES_SUCCESS:
            return Object.assign({}, initialState, {branchesData: action.payload});

        case FETCH_BRANCHES_ERROR:
            return Object.assign({}, initialState, {fetchErrors: action.payload.errorMsg});

        default:
            return state;
    }
}