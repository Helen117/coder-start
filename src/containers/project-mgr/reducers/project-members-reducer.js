/**
 * Created by Administrator on 2016-10-21.
 */
import {
    GET_PROJECTMEMBERS_PENDING,
    GET_PROJECTMEMBERS_SUCCESS,
    GET_PROJECTMEMBERS_ERROR,
} from '../constants/project-members-types';

const initialState = {
};

export default function getProjectMembers(state = initialState, action = {}) {
    switch (action.type) {
        case GET_PROJECTMEMBERS_PENDING:
            return Object.assign({}, initialState, {fetchPMStatus:false,} );
        case GET_PROJECTMEMBERS_SUCCESS:
            return Object.assign({}, initialState, {fetchPMStatus:true, projectMembers: action.payload});
        case GET_PROJECTMEMBERS_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                fetchPMStatus:false,
            };
        default:
            return state;
    }
}