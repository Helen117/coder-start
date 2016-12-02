/**
 * Created by Administrator on 2016-11-30.
 */
import {
    GET_PROJECT_MEMBER_DATA_PENDING,
    GET_PROJECT_MEMBER_DATA_SUCCESS,
    GET_PROJECT_MEMBER_DATA_ERROR
} from '../constants/project-member-data-types';

const initialState = {};

export function getProjectMemberData(state = initialState, action = {}) {
    switch (action.type) {
        case GET_PROJECT_MEMBER_DATA_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});
        case GET_PROJECT_MEMBER_DATA_SUCCESS:
            return Object.assign({}, initialState, {result: action.payload,loading:false,
                disabled:false});
        case GET_PROJECT_MEMBER_DATA_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false,
            };
        default:
            return state;
    }
}