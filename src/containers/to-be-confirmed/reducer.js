/**
 * Created by zhaojp on 2016/11/28.
 */
import { GET_PROJECT_INFO_PENDING ,
    GET_PROJECT_INFO_SUCCESS ,
    GET_PROJECT_INFO_ERROR,

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
        //get project info
        case GET_PROJECT_INFO_PENDING:
            return {...state, getProjectInfoLoading: true, projectInfo:[]};

        case GET_PROJECT_INFO_SUCCESS:
            return {...state, projectInfo: action.payload, getProjectInfoLoading: false};

        case GET_PROJECT_INFO_ERROR:
            return {state,  getProjectInfoLoading: false,};


        //confirm
        case DEVELOP_CONFIRM_PENDING:
            return {...state, confirmLoading: true, confirmResult:null};

        case DEVELOP_CONFIRM_SUCCESS:
            return {...state, confirmResult: action.payload, confirmLoading: false};

        case DEVELOP_CONFIRM_ERROR:
            return {state, confirmLoading: false,};


        //get transpond member
        case GET_TRANSPOND_MEMBER_PENDING:
            return {...state, getTranspondMemberLoading: true, transpondMember:[]};

        case GET_TRANSPOND_MEMBER_SUCCESS:
            return {...state, transpondMember: action.payload, getTranspondMemberLoading: false};

        case GET_TRANSPOND_MEMBER_ERROR:
            return {state, getTranspondMemberLoading: false,};


        //transpond
        case DEVELOP_TRANSPOND_PENDING:
            return {...state, transpondLoading: true, transpondResult:null};

        case DEVELOP_TRANSPOND_SUCCESS:
            return {...state, transpondResult: action.payload, transpondLoading: false};

        case DEVELOP_TRANSPOND_ERROR:
            return {state, transpondLoading: false,};

        default:
            return state;
    }
}

