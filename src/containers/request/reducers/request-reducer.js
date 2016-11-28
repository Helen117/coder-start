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

export  function getBusinessInfo(state = initialState, action = {}) {
    switch (action.type) {
        case 'FETCH_BUSINESS_INFO_PENDING':
            return Object.assign({}, initialState, {pending: true});
        case 'FETCH_BUSINESS_INFO_SUCCESS':
            return Object.assign({}, initialState, {business: action.payload, pending: false, error: null});
        case 'FETCH_BUSINESS_INFO_ERROR':
            return Object.assign({}, initialState, {business: action.payload, pending: false, error: action.payload.errorMsg});

        default:
            return state;
    }
}

export  function getDeveloperInfo(state = initialState, action = {}) {
    switch (action.type) {
        case 'FETCH_DEVELOPER_INFO_PENDING':
            return Object.assign({}, initialState, {pending: true});
        case 'FETCH_DEVELOPER_INFO_SUCCESS':
            return Object.assign({}, initialState, {developer: action.payload, pending: false, error: null});
        case 'FETCH_DEVELOPER_INFO_ERROR':
            return Object.assign({}, initialState, {developer: action.payload, pending: false, error: action.payload.errorMsg});

        default:
            return state;
    }
}

export  function getTesterInfo(state = initialState, action = {}) {
    switch (action.type) {
        case 'FETCH_TESTER_INFO_PENDING':
            return Object.assign({}, initialState, {pending: true});
        case 'FETCH_TESTER_INFO_SUCCESS':
            return Object.assign({}, initialState, {tester: action.payload, pending: false, error: null});
        case 'FETCH_TESTER_INFO_ERROR':
            return Object.assign({}, initialState, {tester: action.payload, pending: false, error: action.payload.errorMsg});

        default:
            return state;
    }
}