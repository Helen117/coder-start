/**
 * Created by Administrator on 2016-09-23.
 */
import {
    ACQUIRE_MYGROUP_PENDING,
    ACQUIRE_MYGROUP_SUCCESS,
    ACQUIRE_MYGROUP_ERROR,
} from '../constants/acquire_mygroup_types';
const initialState = {
};

export default function getMyGroup(state = initialState, action = {}){
    switch (action.type) {
        case ACQUIRE_MYGROUP_PENDING:
            return Object.assign({}, initialState, {fetchStatus:false});
        case ACQUIRE_MYGROUP_SUCCESS:
            return Object.assign({}, initialState, {myGroup: action.payload, fetchStatus:true});
        case ACQUIRE_MYGROUP_ERROR:
            return {
                ...state,
                errors: action.payload.message,
                fetchStatus:false
            };
        default:
            return state;
    }
}
