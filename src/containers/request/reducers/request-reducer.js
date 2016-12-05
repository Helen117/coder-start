/**
 * Created by helen on 2016/11/22.
 */
const initialState = {
};

export default function request(state = initialState, action = {}) {
    switch (action.type) {

        case 'FETCH_TESTER_INFO_PENDING':
            return {...state, getTesterPending: true};
        case 'FETCH_TESTER_INFO_SUCCESS':
            return {...state, tester: action.payload, getTesterPending: false, getTestError: null};
        case 'FETCH_TESTER_INFO_ERROR':
            return {...state, tester: action.payload, getTesterPending: false, getTesterError: action.payload.errorMsg};

        case 'FETCH_DEVELOPER_INFO_PENDING':
            return {...state, getDeveloperPending: true};
        case 'FETCH_DEVELOPER_INFO_SUCCESS':
            return {...state, developer: action.payload, getDeveloperPending: false, getDeveloperError: null};
        case 'FETCH_DEVELOPER_INFO_ERROR':
            return {...state, developer: action.payload, getDeveloperPending: false, getDeveloperError: action.payload.errorMsg};

        case 'FETCH_LABEL_INFO_PENDING':
            return {...state, getLabelPending: true};
        case 'FETCH_LABEL_INFO_SUCCESS':
            return {...state, label: action.payload, getLabelPending: false, getLabelError: null};
        case 'FETCH_LABEL_INFO_ERROR':
            return {...state, label: action.payload, getLabelPending: false, getLabelError: action.payload.errorMsg};

        case 'EDIT_DEMAND_PENDING':
            return {...state, editDemandPending: true};
        case 'EDIT_DEMAND_SUCCESS':
            return {...state, editDemandResult: action.payload, editDemandPending: false,  editDemandError: null};
        case 'EDIT_DEMAND_ERROR':
            return {...state, editDemandResult: action.payload, editDemandPending: false,  editDemandError: action.payload.errorMsg};

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
