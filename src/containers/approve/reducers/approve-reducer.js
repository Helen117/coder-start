/**
 * Created by helen on 2016/10/31.
 */

const initialState = {};

export default function approve(state = initialState, action = {}) {
    switch (action.type) {
        case 'GET_APPROVE_LIST_PENDING':
            return Object.assign({}, initialState, {loading: true});
        case 'GET_APPROVE_LIST_SUCCESS':
            return Object.assign({}, initialState, {approveList:action.payload,errors: null});
        case 'GET_APPROVE_LIST_ERROR':
            return Object.assign({}, initialState, {approveList:null,errors: action.payload.errorMsg});

        case 'APPROVE_RESULT_PENDING':
            return Object.assign({}, initialState, {commitLoading: true});
        case 'APPROVE_RESULT_SUCCESS':
            return Object.assign({}, initialState, {approveResult:action.payload,resultErrors: null});
        case 'APPROVE_RESULT_ERROR':
            return Object.assign({}, initialState, {approveResult:null,resultErrors: action.payload.errorMsg});

        default:
            return state;
    }
}