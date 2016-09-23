/**
 * Created by Administrator on 2016-09-23.
 */
import {
    GET_GROUPMEMBERS_PENDING,
    GET_GROUPMEMBERS_SUCCESS,
    GET_GROUPMEMBERS_ERROR,
} from '../constants/group_members_types';

const initialState = {
};

export default function getGroupMembers(state = initialState, action = {}) {
    console.log("4444");
    switch (action.type) {
        case GET_GROUPMEMBERS_PENDING:
            return Object.assign({}, initialState, {fetchStatus:false,} );
        case GET_GROUPMEMBERS_SUCCESS:
            console.log("333");
            return Object.assign({}, initialState, {fetchStatus:true, groupMembers: action.payload});
        case GET_GROUPMEMBERS_ERROR:
            return {
                ...state,
                errors: action.payload.message,
                fetchStatus:false,
            };
        default:
            return state;
    }
}