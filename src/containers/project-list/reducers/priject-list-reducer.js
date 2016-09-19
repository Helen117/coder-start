/**
 * Created by Administrator on 2016-09-14.
 */
import {
    PROJECT_LIST_SUCCESS,
    PROJECT_LIST_ERROR,
} from '../constants/list-action-types';

//import authUtils from '../../../utils/auth';

const initialState = {
    fetchStatus:false,
    statusErrors:null
};

export default function projectList(state = initialState, action = {}) {
    switch (action.type) {
        case PROJECT_LIST_SUCCESS:
            return Object.assign({}, initialState, {fetchStatus:true, projectList:action.payload});
        case PROJECT_LIST_ERROR:
            return {
                ...state,
                fetchStatus: false,
                statusErrors: action.payload.message
            };
        default:
            return state;
    }
}
