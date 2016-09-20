/**
 * Created by helen on 2016/9/19.
 */
const initialState = {
    members: null,
    mileStones: null,
    fetchErrors: null,
    addIssue: null,
    addIssueError:null,
    issueNotes:null,
    issueNotesErrors:null
};

export default function issue(state = initialState, action = {}) {
    switch (action.type) {

        case 'FETCH_DATA_SUCCESS':
            return Object.assign({}, initialState, {mileStones: action.payload[1].mileStones,members:action.payload[0].members,fetchErrors: null});
        case 'FETCH_DATA_ERROR':
            return Object.assign({}, initialState, {members: null,mileStones:null, fetchErrors: action.payload.errorMsg});

        case 'ADD_ISSUE_SUCCESS':
            return Object.assign({}, initialState, {addIssue: action.payload.success, addIssueError: null});
        case 'ADD_ISSUE_ERROR':
            return Object.assign({}, initialState, {addIssueError: action.payload.errorMsg,addIssue:action.payload.success});

        case 'ISSUE_NOTES_SUCCESS':
            return Object.assign({}, initialState, {issueNotes: action.payload, issueNotesError: null});
        case 'ISSUE_NOTES_ERROR':
            return Object.assign({}, initialState, {issueNotesError: action.payload.errorMsg,issueNotes:null});

        default:
            return state;
    }
}