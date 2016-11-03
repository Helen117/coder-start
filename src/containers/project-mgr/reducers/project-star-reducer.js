/**
 * Created by Administrator on 2016-09-27.
 */
import {
    GET_PROJECTSTAR_PENDING,
    GET_PROJECTSTAR_SUCCESS,
    GET_PROJECTSTAR_ERROR,
} from '../constants/project-star-types';

const initialState = {
};

export default function getProjectStar(state = initialState, action = {}) {
    switch (action.type) {
        case GET_PROJECTSTAR_PENDING:
            return Object.assign({}, initialState, {fetchStatus:false,} );
        case GET_PROJECTSTAR_SUCCESS:
            return Object.assign({}, initialState, {fetchStatus:true, starList: action.payload});
        case GET_PROJECTSTAR_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                fetchStatus:false,
            };
        default:
            return state;
    }
}