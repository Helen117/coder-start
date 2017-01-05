/**
 * Created by zhaojp on 2016/11/23.
 */
import _ from 'lodash';
import {
    ACQUIRE_PERFORMANCE_MSG_PENDING,
    ACQUIRE_PERFORMANCE_MSG_SUCCESS,
    ACQUIRE_PERFORMANCE_MSG_ERROR,

   ACQUIRE_MY_ISSUE_LIST_PENDING,
   ACQUIRE_MY_ISSUE_LIST_SUCCESS,
   ACQUIRE_MY_ISSUE_LIST_ERROR,

    ACQUIRE_USER_RANKING_PENDING,
    ACQUIRE_USER_RANKING_SUCCESS,
    ACQUIRE_USER_RANKING_ERROR,
    
} from '../constants/home-action-types';

const initialState = {

};

export function acqPerformanceMsg(state = initialState, action = {}) {

    switch (action.type) {
        case ACQUIRE_PERFORMANCE_MSG_PENDING:
            return { ...state, performanceMsg:null, performanceMsgLoading:true};
        case ACQUIRE_PERFORMANCE_MSG_SUCCESS:
            return { ...state, performanceMsg: action.payload,performanceMsgLoading:false};
        case ACQUIRE_PERFORMANCE_MSG_ERROR:
            return {...state, performanceMsg:null, performanceMsgLoading:false,};

            
        case ACQUIRE_MY_ISSUE_LIST_PENDING:
            return { ...state, myIssueList:null, myIssueListLoading:true};
        case ACQUIRE_MY_ISSUE_LIST_SUCCESS:
            return { ...state, myIssueList: action.payload, myIssueListLoading:false};
        case ACQUIRE_MY_ISSUE_LIST_ERROR:
            return { ...state, myIssueList:null, myIssueListLoading:false, };


        case ACQUIRE_USER_RANKING_PENDING:
            return { ...state, myRank:null, myRankLoading:true};
        case ACQUIRE_USER_RANKING_SUCCESS:
            return { ...state, myRank: action.payload, myRankLoading:false};
        case ACQUIRE_USER_RANKING_ERROR:
            return { ...state, myRank:null, myRankLoading:false, };
            
            
        case 'NOTIFY_ITEM_PENDING':
            return { ...state, notifyItems:null, notifyItemsLoading:true};
        case 'NOTIFY_ITEM_SUCCESS':
            return { ...state, notifyItems: action.payload, notifyItemsLoading:false};
        case 'NOTIFY_ITEM_ERROR':
            return { ...state, notifyItems:null, notifyItemsLoading:false};
        
        default:
            return state;
    }
}

