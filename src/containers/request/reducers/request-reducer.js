/**
 * Created by helen on 2016/11/22.
 */
const initialState = {
};

export default function request(state = initialState, action = {}) {
    switch (action.type) {

        case 'FETCH_TESTER_INFO_PENDING':
            return {...state, tester:null,getTesterLoading: true, testerWorkloader:null};
        case 'FETCH_TESTER_INFO_SUCCESS':
            return {...state, tester: action.payload, getTesterLoading: false, getTestError: null};
        case 'FETCH_TESTER_INFO_ERROR':
            return {...state, getTesterLoading: false, getTesterError: action.payload.errorMsg};

        case 'FETCH_DEVELOPER_INFO_PENDING':
            return {...state, developer: null, developerWorkloder:null, currentMilestone:null, getDeveloperLoading: true};
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
            return {...state, addRequestResult:null,currentMilestone:null, addRequestLoading: true};
        case 'ADD_DEMAND_SUCCESS':
            return {...state, addRequestResult: action.payload, addRequestLoading: false};
        case 'ADD_DEMAND_ERROR':
            return {...state,  addRequestResult:null,addRequestLoading: false,  addRequestError: action.payload.errorMsg};

        case 'EDIT_DEMAND_PENDING':
            return {...state, editRequestResult: null, currentMilestone:null, editRequestLoading: true};
        case 'EDIT_DEMAND_SUCCESS':
            return {...state, editRequestResult: action.payload, editRequestLoading: false};
        case 'EDIT_DEMAND_ERROR':
            return {...state, editRequestResult: null,editRequestLoading: false,  editRequestError: action.payload.errorMsg};

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


        //auto complete miletone data    
        case 'GET_MILESTONE_BY_NAME_PENDING':
            return {...state, matchMilestone: null, matchMilestoneLoading: true};
        case 'GET_MILESTONE_BY_NAME_SUCCESS':
            return {...state, matchMilestone: action.payload, matchMilestoneLoading: false};
        case 'GET_MILESTONE_BY_NAME_ERROR':
            return {...state, matchMilestone: null, matchMilestoneLoading: false};


        //get developer workload
        case 'GET_DEVELOPER_WORKLOAD_PENDING':
        case 'GET_DEVELOPER_WORKLOAD_ERROR':
            return {...state, developerWorkloder: null};
        case 'GET_DEVELOPER_WORKLOAD_SUCCESS':
            return {...state, developerWorkloder: action.payload};

            
        //get tester workload
        case 'GET_TESTER_WORKLOAD_PENDING':
            return {...state, testerWorkloader: null, testerWorkloaderLoading: true};
        case 'GET_TESTER_WORKLOAD_SUCCESS':
            return {...state, testerWorkloader: action.payload, testerWorkloaderLoading: false};
        case 'GET_TESTER_WORKLOAD_ERROR':
            return {...state, testerWorkloader: null, testerWorkloaderLoading: false};

        //get request state
        case 'GET_REQUEST_STATE_PENDING':
        case 'GET_REQUEST_STATE_ERROR':
            return {...state, requestState: null};
        case 'GET_REQUEST_STATE_SUCCESS':
            return {...state, requestState: action.payload};


        //put query condition into state
        case 'REQUEST_QUERY_CONDITION':
            return {...state, queryCondition: action.queryCondition, page: action.page};

        default:
            return state;
    }
}
