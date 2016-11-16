/**
 * Created by helen on 2016/11/15.
 */
const initialState = {};

export function stageView(state = initialState, action = {}) {
    switch (action.type) {
        case 'FULL_STAGE_PENDING':
            return Object.assign({}, initialState, {loading:true});
        case 'FULL_STAGE_SUCCESS':
            return Object.assign({}, initialState, {workflowStage: action.payload,error: null,loading:false});
        case 'FULL_STAGE_ERROR':
            return Object.assign({}, initialState, {workflowStage:null,error: action.payload.errorMsg,loading:false});
        default:
            return state;
    }
}

export function stageDetail(state = initialState, action = {}) {
    switch (action.type) {
        case 'STAGE_DETAIL_PENDING':
            return Object.assign({}, initialState, {loading:true});
        case 'STAGE_DETAIL_SUCCESS':
            return Object.assign({}, initialState, {stageDetail: action.payload,error: null,loading:false});
        case 'STAGE_DETAIL_ERROR':
            return Object.assign({}, initialState, {stageDetail:null,error: action.payload.errorMsg,loading:false});
        default:
            return state;
    }
}

export function codeChange(state = initialState, action = {}) {
    switch (action.type) {
        case 'CODE_COMMIT_PENDING':
            return Object.assign({}, initialState, {loading:true});
        case 'CODE_COMMIT_SUCCESS':
            return Object.assign({}, initialState, {codeCommit: action.payload,error: null,loading:false});
        case 'CODE_COMMIT_ERROR':
            return Object.assign({}, initialState, {codeCommit:null,error: action.payload.errorMsg,loading:false});
        default:
            return state;
    }
}