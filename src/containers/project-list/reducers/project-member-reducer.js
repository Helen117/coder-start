/**
 * Created by Administrator on 2016-11-18.
 */
import {
    ADD_PROJECT_MEMBER_PENDING,
    ADD_PROJECT_MEMBER_SUCCESS,
    ADD_PROJECT_MEMBER_ERROR,
    DELETE_PROJECT_MEMBER_PENDING,
    DELETE_PROJECT_MEMBER_SUCCESS,
    DELETE_PROJECT_MEMBER_ERROR
} from '../constants/project-member-types';

const initialState = {};

export function addProjectMember(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_PROJECT_MEMBER_PENDING:
            return Object.assign({}, initialState, {addLoading:true,addDisabled:true});
        case ADD_PROJECT_MEMBER_SUCCESS:
            return Object.assign({}, initialState, {addResult: action.payload,addLoading:false,
                deleteDisabled:false});
        case ADD_PROJECT_MEMBER_ERROR:
            return {
                ...state,
                addErrors: action.payload.errorMsg,
                addLoading:false,
                addDisabled:false,
            };
        case DELETE_PROJECT_MEMBER_PENDING:
            return Object.assign({}, initialState, {deleteLoading:true,deleteDisabled:true});
        case DELETE_PROJECT_MEMBER_SUCCESS:
            return Object.assign({}, initialState, {deleteResult: action.payload,deleteLoading:false,
                deleteDisabled:false});
        case DELETE_PROJECT_MEMBER_ERROR:
            return {
                ...state,
                deleteErrors: action.payload.errorMsg,
                deleteLoading:false,
                deleteDisabled:false,
            };
        default:
            return state;
    }
}