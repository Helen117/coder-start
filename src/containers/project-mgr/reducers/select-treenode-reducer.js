/**
 * Created by Administrator on 2016-09-29.
 */
import {
    GET_GROUP_INFO_SUCCESS,
    GET_GROUP_INFO_ERROR,
    GET_PROJECT_INFO_SUCCESS,
    GET_PROJECT_INFO_ERROR,
} from '../constants/select-treenode-types';

const initialState = {
};

export function getGroupInfo(state = initialState, action = {}) {
    switch (action.type) {
        case GET_GROUP_INFO_SUCCESS:
            return Object.assign({}, initialState, {groupInfo: action.data});
        case GET_GROUP_INFO_ERROR:
            return {
                ...state,
                errors: action.errMessage
            };
        default:
            return state;
    }
}

export function getProjectInfo(state = initialState, action = {}) {
    switch (action.type) {
        case GET_PROJECT_INFO_SUCCESS:
            return Object.assign({}, initialState, {projectInfo: action.data});
        case GET_PROJECT_INFO_ERROR:
            return {
                ...state,
                errors: action.errMessage
            };
        default:
            return state;
    }
}
