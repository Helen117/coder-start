/**
 * Created by helen on 2016/10/9.
 */

const initialState = {
};

export default function forkProject(state = initialState, action = {}) {
    switch (action.type) {

        case 'GET_NAMESPACE_SUCCESS':
            return {...state,namespace: action.payload};
        case 'GET_NAMESPACE_ERROR':
            return {
                ...state,
                getNamespaceError: action.payload.errorMsg
            };

        case 'FORK_PROJECT_PENDING':
            return {...state,loading: true,forkProject:null};
        case 'FORK_PROJECT_SUCCESS':
            return {...state,loading: false, forkProject: action.payload,errors:null};
        case 'FORK_PROJECT_ERROR':
            return {
                ...state,
                errors: action.payload.errorMsg, loading: false,forkProject:null
            };

        case 'GET_FORK_LIST_PENDING':
            return Object.assign({}, initialState, {pending:true});
        case 'GET_FORK_LIST_SUCCESS':
            return Object.assign({}, initialState, {forksInfo: action.payload, error: null});
        case 'GET_FORK_LIST_ERROR':
            return Object.assign({}, initialState, {error: action.payload.errorMsg,forksInfo:null});

        default:
            return state;
    }
}