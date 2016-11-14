/**
 * Created by helen on 2016/9/19.
 */
const initialState = {
    milestones: null,
    members: null,
    labels: null
};

export function GetIssueDependent(state = initialState, action = {}) {
    switch (action.type) {

        case 'FETCH_DATA_SUCCESS':
            return Object.assign({}, initialState, {milestones: action.payload.milestones,members:action.payload.members,labels:action.payload.labels,fetchErrors: null});
        case 'FETCH_DATA_ERROR':
            return Object.assign({}, initialState, {milestones:null,members:null,labels:null, fetchErrors: action.payload.errorMsg});
        default:
            return state;
    }
}

export function issue(state = {}, action = {}) {
    switch (action.type) {
        case 'ADD_ISSUE_SUCCESS':
            return Object.assign({}, {addIssue: action.payload});
        case 'ADD_ISSUE_ERROR':
            return Object.assign({}, {addIssueError: action.payload.errorMsg});

        case 'ISSUE_NOTES_SUCCESS':
            return Object.assign({}, {issueNotes: action.payload});
        case 'ISSUE_NOTES_ERROR':
            return Object.assign({}, {issueNotesError: action.payload.errorMsg});

        case 'GET_ISSUE_LIST_PENDING':
            return Object.assign({}, {loading: true});
        case 'GET_ISSUE_LIST_SUCCESS':
            return Object.assign({}, {loading: false, issueList: action.payload});
        case 'GET_ISSUE_LIST_ERROR':
            return {
                ...state,
                errors: action.payload.errorMsg, loading: false
            };

        case 'GET_MY_ISSUE_PENDING':
            return Object.assign({}, {myIssueLoading: true});
        case 'GET_MY_ISSUE_SUCCESS':
            return Object.assign({}, {myIssueLoading: false, myIssueList: action.payload});
        case 'GET_MY_ISSUE_ERROR':
            return {
                ...state,
                myIssueError: action.payload.errorMsg, myIssueLoading: false
            };

        case 'COMMENT_PENDING':
            return Object.assign({}, {commentLoading: true});
        case 'COMMENT_SUCCESS':
            return Object.assign({}, {commentLoading: false,comment: action.payload});
        case 'COMMENT_ERROR':
            return Object.assign({}, {commentLoading: false,commentError:action.payload.errorMsg});

        case 'UPDATE_ISSUE_SUCCESS':
            return Object.assign({}, {updateIssue: action.payload});
        case 'UPDATE_ISSUE_ERROR':
            return Object.assign({}, {updateIssueError: action.payload.errorMsg});

        default:
            return state;
    }
}


export function GetIssueDemand(state = {}, action = {}) {
    switch (action.type) {
        case 'GET_DEMAND_PENDING':
            return Object.assign({}, {pending:true});
        case 'GET_DEMAND_SUCCESS':
            return Object.assign({}, {demands: action.payload,errors: null});
        case 'GET_DEMAND_ERROR':
            return Object.assign({},{demands:null,errors: action.payload.errorMsg});
        default:
            return state;
    }
}