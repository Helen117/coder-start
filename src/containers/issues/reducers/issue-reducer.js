/**
 * Created by helen on 2016/9/19.
 */

export default function issue(state = {}, action = {}) {
    switch (action.type) {
        case 'ADD_ISSUE_SUCCESS':
            return {...state,addIssue: action.payload};
        case 'ADD_ISSUE_ERROR':
            return {...state,addIssueError: action.payload.errorMsg,addIssue:null};

        case 'ISSUE_NOTES_SUCCESS':
            return {...state,issueNotes: action.payload};
        case 'ISSUE_NOTES_ERROR':
            return {...state,issueNotesError: action.payload.errorMsg,issueNotes:null};

        case 'GET_ISSUE_LIST_PENDING':
            return {...state,loading: true,issueList:null};
        case 'GET_ISSUE_LIST_SUCCESS':
            return {...state,loading: false, issueList: action.payload};
        case 'GET_ISSUE_LIST_ERROR':
            return {
                ...state,
                errors: action.payload.errorMsg, loading: false,issueList:null
            };

        case 'GET_MY_ISSUE_PENDING':
            return {...state,myIssueLoading: true,myIssueList:null};
        case 'GET_MY_ISSUE_SUCCESS':
            return {...state,myIssueLoading: false, myIssueList: action.payload};
        case 'GET_MY_ISSUE_ERROR':
            return {
                ...state,
                myIssueError: action.payload.errorMsg, myIssueLoading: false,myIssueList:null
            };

        case 'COMMENT_PENDING':
            return {...state,commentLoading: true,comment:null};
        case 'COMMENT_SUCCESS':
            return {...state,commentLoading: false,comment: action.payload};
        case 'COMMENT_ERROR':
            return {...state,commentLoading: false,commentError:action.payload.errorMsg,comment:null};

        case 'UPDATE_ISSUE_PENDING':
            return {...state,updateIssueLoading: true,updateIssue:null};
        case 'UPDATE_ISSUE_SUCCESS':
            return {...state,updateIssue: action.payload,updateIssueLoading:false};
        case 'UPDATE_ISSUE_ERROR':
            return {...state,updateIssueError: action.payload.errorMsg,updateIssueLoading:false,updateIssue:null};

        case 'PROJECT_DEVELOPER_PENDING':
            return {...state,fetchDeveloperPending:true,members:null};
        case 'PROJECT_DEVELOPER_SUCCESS':
            return {...state,members: action.payload,fetchDeveloperErrors: null,fetchDeveloperPending:false};
        case 'PROJECT_DEVELOPER_ERROR':
            return {...state,members:null,fetchDeveloperErrors: action.payload.errorMsg,fetchDeveloperPending:false};

        case 'PROJECT_MILESTONE_PENDING':
            return {...state,fetchMilestonePending:true,milestones:null};
        case 'PROJECT_MILESTONE_SUCCESS':
            return {...state,milestones: action.payload,fetchMilestoneErrors: null,fetchMilestonePending:false};
        case 'PROJECT_MILESTONE_ERROR':
            return {...state,milestones:null,fetchMilestoneErrors: action.payload.errorMsg,fetchMilestonePending:false};

        case 'PROJECT_LABEL_PENDING':
            return {...state,fetchLabelPending:true,labels:null};
        case 'PROJECT_LABEL_SUCCESS':
            return {...state,labels: action.payload,fetchLabelErrors: null,fetchLabelPending:false};
        case 'PROJECT_LABEL_ERROR':
            return {...state,labels:null,fetchLabelErrors: action.payload.errorMsg,fetchLabelPending:false};

        case 'GET_DEMAND_PENDING':
            return {...state,pending:true,demands:null};
        case 'GET_DEMAND_SUCCESS':
            return {...state,demands: action.payload,errors: null};
        case 'GET_DEMAND_ERROR':
            return {...state,demands:null,errors: action.payload.errorMsg};

        case 'REVERT_BUG_PENDING':
            return {...state,revertBugPending:true,revertBug:null};
        case 'REVERT_BUG_SUCCESS':
            return {...state,revertBug: action.payload,revertBugError: null,revertBugPending:false};
        case 'REVERT_BUG_ERROR':
            return {...state,revertBug:null,revertBugError: action.payload.errorMsg,revertBugPending:false};

        default:
            return state;
    }
}
