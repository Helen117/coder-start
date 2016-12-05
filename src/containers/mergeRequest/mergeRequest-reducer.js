/**
 * Created by zhaojp on 2016/10/8.
 */
import _ from 'lodash';
import {
    FETCH_MERGE_PATH_PENDING,
    FETCH_MERGE_PATH_SUCCESS,
    FETCH_MERGE_PATH_ERROR,

    FETCH_ISSUES_DATA_PENDING,
    FETCH_ISSUES_DATA_SUCCESS,
    FETCH_ISSUES_DATA_ERROR,

    CREATE_MR_PENDING,
    CREATE_MR_SUCCESS,
    CREATE_MR_ERROR,

    FETCH_MR_LIST_PENDING,
    FETCH_MR_LIST_SUCCESS,
    FETCH_MR_LIST_ERROR,
} from './action-types';


const initialState = {

};

export function mergeRequest(state = initialState, action = {}) {

    switch (action.type) {

        //get merge path
        case FETCH_MERGE_PATH_PENDING:
            return {...state, fetchMergePath: true, isMR:true};

        case FETCH_MERGE_PATH_SUCCESS:
            let isMR = false;
            if(action.payload.length > 1){
                isMR = true;
            }
            return {...state, mergeBranch: action.payload, isMR:isMR,fetchMergePath: false};

        case FETCH_MERGE_PATH_ERROR:
            return {...state, fetchMergePath: false};

            
        //fetch merge issue    
        case FETCH_ISSUES_DATA_PENDING:
            return {...state, fetchIssueLoading: true};

        case FETCH_ISSUES_DATA_SUCCESS:
            return {...state, Issues: action.payload, fetchIssueLoading: false };

        case FETCH_ISSUES_DATA_ERROR:
            return {state, fetchIssueLoading: false, fetchIssueLoading: false };


        //create mr
        case CREATE_MR_PENDING:
            return {...state, createLoading:true};

        case CREATE_MR_SUCCESS:
            return {...state, createResult: action.payload, createLoading:false};

        case CREATE_MR_ERROR:
            return { ...state, createLoading:false, };


        //get mr list
        case FETCH_MR_LIST_PENDING:
            return {...state, getMrListLoading: true};

        case FETCH_MR_LIST_SUCCESS:
            return {...state, mrList: action.payload,  getMrListLoading:false};

        case FETCH_MR_LIST_ERROR:
            return {...state, getMrListLoading:false};

        default:
            return state;

    }
}






