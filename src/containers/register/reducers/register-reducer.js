/**
 * Created by helen on 2016/9/18.
 */

export default function register(state={}, action = {}) {
    // console.log('state:',state);
    switch (action.type) {
        case 'REGISTER_PENDING':
            return {...state, registering: true,registerResult:null};
        case 'REGISTER_SUCCESS':
            return {...state, registerResult: action.payload, registering: false, registerErrors: null};
        case 'REGISTER_ERROR':
            return {...state, registerResult: null, registering: false, registerErrors: action.payload.errorMsg};

        case 'GET_LEADER_PENDING':
            return {...state, getLeaderPending: true,leader:null};
        case 'GET_LEADER_SUCCESS':
            return {...state, leader: action.payload,getLeaderPending: false};
        case 'GET_LEADER_ERROR':
            return {...state, getLeaderErrorMsg: action.payload.errorMsg,getLeaderPending: false,leader:null};

        case 'GET_ORGANIZATION_PENDING':
            return {...state, getOrganizePending: true,organization:null};
        case 'GET_ORGANIZATION_SUCCESS':
            return {...state, organization: action.payload,getOrganizePending:false};
        case 'GET_ORGANIZATION_ERROR':
            return {...state, getOrganizeErrorMsg: action.payload.errorMsg,getOrganizePending:false,organization:null};

        case 'GET_ROLE_PENDING':
            return {...state, getRolePending: true,role:null};
        case 'GET_ROLE_SUCCESS':
            return {...state, role: action.payload,getRolePending:false};
        case 'GET_ROLE_ERROR':
            return {...state, getRoleErrorMsg: action.payload.errorMsg,getRolePending:false,role:null};

        case 'GET_ALL_USER_PENDING':
            return {...state, getUsersPending:true,users:null};
        case 'GET_ALL_USER_SUCCESS':
            return {...state, users: action.payload,getUsersPending:false};
        case 'GET_ALL_USER_ERROR':
            return {...state, users:null,getUsersPending:false,getUserError:action.payload.errorMsg};
        default:
            return state;
    }
}