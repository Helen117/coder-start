/**
 * Created by Administrator on 2016-11-18.
 */
import {
    ADD_PROJECT_MEMBER_PENDING,
    ADD_PROJECT_MEMBER_SUCCESS,
    ADD_PROJECT_MEMBER_ERROR,
    DELETE_PROJECT_MEMBER_PENDING,
    DELETE_PROJECT_MEMBER_SUCCESS,
    DELETE_PROJECT_MEMBER_ERROR,
    GET_PROJECTMEMBERS_PENDING,
    GET_PROJECTMEMBERS_SUCCESS,
    GET_PROJECTMEMBERS_ERROR
} from '../constants/project-member-types';

const initialState = {};

export function projectMember(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_PROJECT_MEMBER_PENDING:
            return {...state,addProjectMember:{loading:true,disabled:true}};
        case ADD_PROJECT_MEMBER_SUCCESS:
            return {...state,addProjectMember:{result: action.payload,loading:false,
                disabled:false}};
        case ADD_PROJECT_MEMBER_ERROR:
            return {
                ...state,addProjectMember:{loading:false, disabled:false}
            };
        case DELETE_PROJECT_MEMBER_PENDING:
            return {...state,deleteProjectMember:{deleteLoading:true,deleteDisabled:true}};
        case DELETE_PROJECT_MEMBER_SUCCESS:
            return {...state,deleteProjectMember:{result: action.payload,deleteLoading:false,
            deleteDisabled:false}};
        case DELETE_PROJECT_MEMBER_ERROR:
            return {
                ...state,deleteProjectMember:{deleteLoading:false, deleteDisabled:false,}
            };
        //获取项目成员
        case GET_PROJECTMEMBERS_PENDING:
            return {...state,getProjectMembers:{fetchPMStatus:false, loading:true}};
        case GET_PROJECTMEMBERS_SUCCESS:
            return {...state,getProjectMembers:{fetchPMStatus:true, projectMembers: action.payload,loading:false}};
        case GET_PROJECTMEMBERS_ERROR:
            return {
                ...state,getProjectMembers:{fetchPMStatus:false, loading:false}
            };
        default:
            return state;
    }
}