/**
 * Created by Administrator on 2016-09-29.
 */
import {
    GET_GROUP_INFO_SUCCESS,
    GET_GROUP_INFO_ERROR,
    GET_PROJECT_INFO_SUCCESS,
    GET_PROJECT_INFO_PENDING,
    GET_PROJECT_INFO_ERROR,
} from '../constants/select-treenode-types';

const initialState = {
};

export function getGroupInfo(state = initialState, action = {}) {
    switch (action.type) {
        case GET_GROUP_INFO_SUCCESS:
            return Object.assign({}, initialState, {groupInfo: action.data, selectedNode: action.selectNodeData});
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
        case GET_PROJECT_INFO_PENDING:
            return Object.assign({}, initialState, {fetchProjectStatus: false,loading:true});
        case GET_PROJECT_INFO_SUCCESS:
            return Object.assign({}, initialState, {fetchProjectStatus: true,projectInfo: action.payload, loading:false});
        case GET_PROJECT_INFO_ERROR:
            return {
                ...state,
                errors: action.errMessage,
                loading:false
            };
        default:
            return state;
    }
}
