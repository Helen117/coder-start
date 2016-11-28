/**
 * Created by helen on 2016/11/22.
 */
const initialState = {
};

export  function request(state = initialState, action = {}) {
    switch (action.type) {
        case 'EDIT_DEMAND_PENDING':
            return Object.assign({}, initialState, {pending: true});
        case 'EDIT_DEMAND_SUCCESS':
            return Object.assign({}, initialState, {editDemandResult: action.payload, pending: false, error: null});
        case 'EDIT_DEMAND_ERROR':
            return Object.assign({}, initialState, {editDemandResult: action.payload, pending: false, error: action.payload.errorMsg});

        case 'FETCH_REQUIREMENT_INFO_PENDING':
            return Object.assign({}, initialState, {loading: true});
        case 'FETCH_REQUIREMENT_INFO_SUCCESS':
            return Object.assign({}, initialState, {requirementInfo: action.payload, loading: false, errors: null});
        case 'FETCH_REQUIREMENT_INFO_ERROR':
            return Object.assign({}, initialState, {requirementInfo: action.payload, loading: false, errors: action.payload.errorMsg});

        default:
            return state;
    }
}