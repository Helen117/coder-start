/**
 * Created by helen on 2016/10/9.
 */

const initialState = {
};

export default function forkProject(state = initialState, action = {}) {
    switch (action.type) {
        case 'FORK_PROJECT_PENDING':
            return Object.assign({}, initialState, {loading: true});
        case 'FORK_PROJECT_SUCCESS':
            return Object.assign({}, initialState, {loading: false, forkProject: action.payload});
        case 'FORK_PROJECT_ERROR':
            return {
                ...state,
                errors: action.payload.errorMsg, loading: false
            };

        case 'GET_FORK_LIST_SUCCESS':
            return Object.assign({}, initialState, {forksInfo: action.payload, error: null});
        case 'GET_FORK_LIST_ERROR':
            return Object.assign({}, initialState, {error: action.payload.errorMsg,forksInfo:null});

        default:
            return state;
    }
}