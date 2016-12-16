/**
 * Created by helen on 2016/9/19.
 */

export default function issue(state = {}, action = {}) {
    switch (action.type) {
        case 'ADD_ISSUE_SUCCESS':
            return {...state,addIssue: action.payload};
        case 'ADD_ISSUE_ERROR':
            return {...state,addIssueError: action.payload.errorMsg};

        case 'ISSUE_NOTES_SUCCESS':
            return {...state,issueNotes: action.payload};
        case 'ISSUE_NOTES_ERROR':
            return {...state,issueNotesError: action.payload.errorMsg};

        case 'GET_ISSUE_LIST_PENDING':
            return {...state,loading: true};
        case 'GET_ISSUE_LIST_SUCCESS':
            return {...state,loading: false, issueList: action.payload};
        case 'GET_ISSUE_LIST_ERROR':
            return {
                ...state,
                errors: action.payload.errorMsg, loading: false
            };

        case 'GET_MY_ISSUE_PENDING':
            return {...state,myIssueLoading: true};
        case 'GET_MY_ISSUE_SUCCESS':
            return {...state,myIssueLoading: false, myIssueList: action.payload};
        case 'GET_MY_ISSUE_ERROR':
            return {
                ...state,
                myIssueError: action.payload.errorMsg, myIssueLoading: false
            };

        case 'COMMENT_PENDING':
            return {...state,commentLoading: true};
        case 'COMMENT_SUCCESS':
            return {...state,commentLoading: false,comment: action.payload};
        case 'COMMENT_ERROR':
            return {...state,commentLoading: false,commentError:action.payload.errorMsg};

        case 'UPDATE_ISSUE_PENDING':
            return {...state,updateIssueLoading: true};
        case 'UPDATE_ISSUE_SUCCESS':
            return {...state,updateIssue: action.payload,updateIssueLoading:false};
        case 'UPDATE_ISSUE_ERROR':
            return {...state,updateIssueError: action.payload.errorMsg,updateIssueLoading:false};

        case 'FETCH_DATA_SUCCESS':
            return {...state,milestones: action.payload.milestones,members:action.payload.members,labels:action.payload.labels,fetchErrors: null};
        case 'FETCH_DATA_ERROR':
            return {...state,milestones:null,members:null,labels:null, fetchErrors: action.payload.errorMsg};

        case 'GET_DEMAND_PENDING':
            return {...state,pending:true};
        case 'GET_DEMAND_SUCCESS':
            return {...state,demands: action.payload,errors: null};
        case 'GET_DEMAND_ERROR':
            return {...state,demands:null,errors: action.payload.errorMsg};

        default:
            return state;
    }
}
