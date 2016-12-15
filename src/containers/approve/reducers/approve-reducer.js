/**
 * Created by helen on 2016/10/31.
 */

const initialState = {};

export default function approve(state = initialState, action = {}) {
    switch (action.type) {
        case 'GET_APPROVE_LIST_PENDING':
            return Object.assign({}, initialState, {approveList:null, loading: true});
        case 'GET_APPROVE_LIST_SUCCESS':
            return Object.assign({}, initialState, {approveList:action.payload,errors: null,loading: false});
        case 'GET_APPROVE_LIST_ERROR':
            return Object.assign({}, initialState, {loading: false,approveList:null,errors: action.payload.errorMsg});

        case 'APPROVAL_DETAIL_PENDING':
            return {...state, approvalDetail:null, getDetailLoading: true};
        case 'APPROVAL_DETAIL_SUCCESS':
            return {...state,approvalDetail: action.payload, getDetailLoading: false};
        case 'APPROVAL_DETAIL_ERROR':
            return {...state,approvalDetail:null,getDetailError: action.payload.errorMsg, getDetailLoading: false};

        case 'APPROVE_RESULT_PENDING':
            return {...state,approveResult:null, commitLoading: true};
        case 'APPROVE_RESULT_SUCCESS':
            return {...state,approveResult:action.payload,resultErrors: null,commitLoading: false};
        case 'APPROVE_RESULT_ERROR':
            return {...state,commitLoading: false,approveResult:null,resultErrors: action.payload.errorMsg};


        case 'GET_CODE_CHANGES_PENDING':
            return {...state,codeChanges:null, codeChangesLoading: true};
        case 'GET_CODE_CHANGES_SUCCESS':
            return {...state,codeChanges:action.payload, codeChangesLoading: false};
        case 'GET_CODE_CHANGES_ERROR':
            return {...state,codeChanges:null, codeChangesLoading: false};

        case 'APPROVE_MR_PENDING':
            return {...state,approveMrResult:null, approveMrLoading: true};
        case 'APPROVE_MR_SUCCESS':
            return {...state,approveMrResult:action.payload, approveMrLoading: false};
        case 'APPROVE_MR_ERROR':
            return {...state,approveMrResult:null, approveMrLoading: false};
            
        default:
            return state;
    }
}
