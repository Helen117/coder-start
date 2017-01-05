/**
 * Created by zhaojp on 2016/11/28.
 */
import {GET_CONFIRM_LIST_PENDING ,
    GET_CONFIRM_LIST_SUCCESS ,
    GET_CONFIRM_LIST_ERROR,
    
    GET_MY_PROJECT_INFO_PENDING ,
    GET_MY_PROJECT_INFO_SUCCESS ,
    GET_MY_PROJECT_INFO_ERROR,

    DEVELOP_CONFIRM_PENDING ,
    DEVELOP_CONFIRM_SUCCESS ,
    DEVELOP_CONFIRM_ERROR,

    GET_TRANSPOND_MEMBER_PENDING ,
    GET_TRANSPOND_MEMBER_SUCCESS ,
    GET_TRANSPOND_MEMBER_ERROR,

    DEVELOP_TRANSPOND_PENDING ,
    DEVELOP_TRANSPOND_SUCCESS ,
    DEVELOP_TRANSPOND_ERROR,
} from './action-types';

const initialState = {
};

export function toBeConfirmedItem(state = initialState, action = {}) {

    switch (action.type) {
        //get confirm list
        case GET_CONFIRM_LIST_PENDING:
            return {...state, getConfirmListLoading: true,confirmList:null,demand:null};

        case GET_CONFIRM_LIST_SUCCESS:
            return {...state, confirmList: action.payload, getConfirmListLoading: false};

        case GET_CONFIRM_LIST_ERROR:
            return {...state,  getConfirmListLoading: false,confirmList:null};

        case 'GET_DEMAND_INFO_PENDING':
            return {...state, getDemandLoading: true,demand:null,confirmList:null,demandProjectInfo:null};

        case 'GET_DEMAND_INFO_SUCCESS':
            return {...state, demand: action.payload, getDemandLoading: false};

        case 'GET_DEMAND_INFO_ERROR':
            return {...state,  getDemandLoading: false,demand:null};
            
        //get project info
        case GET_MY_PROJECT_INFO_PENDING:
            return {...state, projectInfo:null,getProjectInfoLoading: true};

        case GET_MY_PROJECT_INFO_SUCCESS:
            return {...state, projectInfo: action.payload, getProjectInfoLoading: false};

        case GET_MY_PROJECT_INFO_ERROR:
            return {...state,  projectInfo:null,getProjectInfoLoading: false,};

        case 'GET_DEMAND_PROJECT_INFO_PENDING':
            return {...state, demandProjectInfo:null,getDemandProjectInfoLoading: true};

        case 'GET_DEMAND_PROJECT_INFO_SUCCESS':
            return {...state, demandProjectInfo: action.payload, getDemandProjectInfoLoading: false};

        case 'GET_DEMAND_PROJECT_INFO_ERROR':
            return {...state,  demandProjectInfo:null,getDemandProjectInfoLoading: false,};

        //confirm
        case DEVELOP_CONFIRM_PENDING:
            return {...state,confirmResult:null, confirmLoading: true};

        case DEVELOP_CONFIRM_SUCCESS:
            return {...state, confirmResult: action.payload, confirmLoading: false};

        case DEVELOP_CONFIRM_ERROR:
            return {...state, confirmResult:null,confirmLoading: false,};


        //get transpond member
        case GET_TRANSPOND_MEMBER_PENDING:
            return {...state, transpondMember:null, getTranspondMemberLoading: true,};

        case GET_TRANSPOND_MEMBER_SUCCESS:
            return {...state, transpondMember: action.payload, getTranspondMemberLoading: false};

        case GET_TRANSPOND_MEMBER_ERROR:
            return {...state, transpondMember:null,getTranspondMemberLoading: false,};


        //transpond
        case DEVELOP_TRANSPOND_PENDING:
            return {...state, transpondResult:null,transpondLoading: true};

        case DEVELOP_TRANSPOND_SUCCESS:
            return {...state, transpondResult: action.payload, transpondLoading: false};

        case DEVELOP_TRANSPOND_ERROR:
            return {...state, transpondResult:null,transpondLoading: false,};

        default:
            return state;
    }
}

