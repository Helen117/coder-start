/**
 * Created by helen on 2016/11/22.
 */
const initialState = {
};

export default function request(state = initialState, action = {}) {
    switch (action.type) {

        case 'FETCH_TESTER_INFO_PENDING':
            return {...state, tester:null,getTesterLoading: true};
        case 'FETCH_TESTER_INFO_SUCCESS':
            return {...state, tester: action.payload, getTesterLoading: false, getTestError: null};
        case 'FETCH_TESTER_INFO_ERROR':
            return {...state, getTesterLoading: false, getTesterError: action.payload.errorMsg};

        case 'FETCH_DEVELOPER_INFO_PENDING':
            return {...state, developer: null,getDeveloperLoading: true};
        case 'FETCH_DEVELOPER_INFO_SUCCESS':
            return {...state, developer: action.payload, getDeveloperLoading: false, getDeveloperError: null};
        case 'FETCH_DEVELOPER_INFO_ERROR':
            return {...state,  getDeveloperLoading: false, getDeveloperError: action.payload.errorMsg};

        case 'FETCH_LABEL_INFO_PENDING':
            return {...state, getLabelLoading: true};
        case 'FETCH_LABEL_INFO_SUCCESS':
            return {...state, label: action.payload, getLabelLoading: false, getLabelError: null};
        case 'FETCH_LABEL_INFO_ERROR':
            return {...state,  getLabelLoading: false, getLabelError: action.payload.errorMsg};

        case 'ADD_DEMAND_PENDING':
            return {...state, addDemandResult:null,addDemandLoading: true};
        case 'ADD_DEMAND_SUCCESS':
            return {...state, addDemandResult: action.payload, addDemandLoading: false};
        case 'ADD_DEMAND_ERROR':
            return {...state,  addDemandResult:null,addDemandLoading: false,  addDemandError: action.payload.errorMsg};

        case 'EDIT_DEMAND_PENDING':
            return {...state, editDemandResult: null,editDemandLoading: true};
        case 'EDIT_DEMAND_SUCCESS':
            return {...state, editDemandResult: action.payload, editDemandLoading: false};
        case 'EDIT_DEMAND_ERROR':
            return {...state, editDemandResult: null,editDemandLoading: false,  editDemandError: action.payload.errorMsg};

        case 'FETCH_REQUIREMENT_INFO_PENDING':
            return {...state,requirementInfo: null,loading: true};
        case 'FETCH_REQUIREMENT_INFO_SUCCESS':
            return {...state, requirementInfo: action.payload, loading: false, errors: null};
        case 'FETCH_REQUIREMENT_INFO_ERROR':
            return {...state, loading: false, errors: action.payload.errorMsg};


        case 'DELETE_REQUIREMENT_INFO_PENDING':
            return {...state, deleteResult: null, deleteLoading: true};
        case 'DELETE_REQUIREMENT_INFO_SUCCESS':
            return {...state, deleteResult: action.payload, deleteLoading: false};
        case 'DELETE_REQUIREMENT_INFO_ERROR':
            return {...state, deleteResult: null, deleteLoading: false};

        default:
            return state;
    }
}
