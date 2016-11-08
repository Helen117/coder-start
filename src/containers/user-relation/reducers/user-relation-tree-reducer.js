/**
 * Created by Administrator on 2016-11-07.
 */
import {
    GET_USER_RELATION_TREE_PENDING,
    GET_USER_RELATION_TREE_SUCCESS,
    GET_USER_RELATION_TREE_ERROR,
} from '../constants/user-relation-tree-types';
import {LOGOUT} from '../../login/constants/login-action-types';

const initialState = {
    userTreeData: [],
};

export default function getUserRelationTree(state = initialState, action = {}) {
    switch (action.type) {
        case GET_USER_RELATION_TREE_PENDING:
            return Object.assign({}, initialState, {loading: true});
        case GET_USER_RELATION_TREE_SUCCESS:
            return Object.assign({}, initialState, {loading: false, userTreeData: action.payload});
        case GET_USER_RELATION_TREE_ERROR:
            return {
                ...state,
                errors: action.payload.message, loading: false
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}