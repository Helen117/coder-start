/**
 * Created by helen on 2016/9/19.
 */
const initialState = {

};

export default function issue(state = initialState, action = {}) {
    switch (action.type) {

        case 'FETCH_DATA_SUCCESS':
            return Object.assign({}, initialState, {mileStones: action.payload[1].mileStones,members:action.payload[0].members,fetchErrors: null});
        case 'FETCH_DATA_ERROR':
            return Object.assign({}, initialState, {members: null,mileStones:null, fetchErrors: action.payload.errorMsg});

        case 'ADD_ISSUE_SUCCESS':
            return Object.assign({}, initialState, {addIssue: action.payload, addIssueError: null});
        case 'ADD_ISSUE_ERROR':
            return Object.assign({}, initialState, {addIssueError: action.payload.errorMsg,addIssue:action.payload});

        case 'ISSUE_NOTES_SUCCESS':
            return Object.assign({}, initialState, {issueNotes: action.payload, issueNotesError: null});
        case 'ISSUE_NOTES_ERROR':
            return Object.assign({}, initialState, {issueNotesError: action.payload.errorMsg,issueNotes:null});

        case 'GET_ISSUE_LIST_PENDING':
            return Object.assign({}, initialState, {loading: true});
        case 'GET_ISSUE_LIST_SUCCESS':
            return Object.assign({}, initialState, {loading: false, issueList: action.payload});
        case 'GET_ISSUE_LIST_ERROR':
            return {
                ...state,
                errors: action.payload.errorMsg, loading: false
            };

        case 'COMMENT_SUCCESS':
            return Object.assign({}, initialState, {comment: action.payload});

        default:
            return state;
    }
}