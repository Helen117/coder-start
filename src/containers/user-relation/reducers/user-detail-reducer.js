/**
 * Created by Administrator on 2016-11-10.
 */
import {
    MOVE_USER_PENDING,
    MOVE_USER_SUCCESS,
    MOVE_USER_ERROR,
    DELETE_GROUP_USER_PENDING,
    DELETE_GROUP_USER_SUCCESS,
    DELETE_GROUP_USER_ERROR,
    UPDATE_USER_PENDING,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR
} from '../constants/user-detail-types';

const initialState = {
};

export default function createUser(state = initialState, action = {}) {
    switch (action.type) {
        case MOVE_USER_PENDING:
            return Object.assign({}, initialState, {moveLoading:true,moveDisabled:true});
        case MOVE_USER_SUCCESS:
            return Object.assign({}, initialState, {moveResult: action.payload,moveLoading:false,
                moveDisabled:false});
        case MOVE_USER_ERROR:
            return {
                ...state,
                moveErrors: action.payload.errorMsg,
                moveLoading:false,
                moveDisabled:false,
            };
        case DELETE_GROUP_USER_PENDING:
            return Object.assign({}, initialState, {deleteLoading:true,deleteDisabled:true});
        case DELETE_GROUP_USER_SUCCESS:
            return Object.assign({}, initialState, {deleteResult: action.payload,deleteLoading:false,
                deleteDisabled:false});
        case DELETE_GROUP_USER_ERROR:
            return {
                ...state,
                deleteErrors: action.payload.errorMsg,
                deleteLoading:false,
                deleteDisabled:false,
            };
        case UPDATE_USER_PENDING:
            return Object.assign({}, initialState, {updateLoading:true,updateDisabled:true});
        case UPDATE_USER_SUCCESS:
            return Object.assign({}, initialState, {updateResult: action.payload,updateLoading:false,
                updateDisabled:false});
        case UPDATE_USER_ERROR:
            return {
                ...state,
                updateErrors: action.payload.errorMsg,
                updateLoading:false,
                updateDisabled:false,
            };
        default:
            return state;
    }
}