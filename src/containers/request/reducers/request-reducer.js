/**
 * Created by helen on 2016/11/22.
 */
const initialState = {
};

export  function request(state = initialState, action = {}) {
    switch (action.type) {
        case 'ADD_REQUEST_PENDING':
            return Object.assign({}, initialState, {pending: true});
        case 'ADD_REQUEST_SUCCESS':
            return Object.assign({}, initialState, {addResult: action.payload, pending: false, error: null});
        case 'ADD_REQUEST_ERROR':
            return Object.assign({}, initialState, {addResult: action.payload, pending: false, error: action.payload.errorMsg});
        default:
            return state;
    }
}