/**
 * Created by zhaojp on 2016/11/23.
 */
import _ from 'lodash';
import {
    ACQUIRE_PERFORMANCE_MSG_PENDING,
    ACQUIRE_PERFORMANCE_MSG_SUCCESS,
    ACQUIRE_PERFORMANCE_MSG_ERROR,

} from '../constants/home-action-types';

const initialState = {

};

export function acqPerformanceMsg(state = initialState, action = {}) {

    switch (action.type) {
        case ACQUIRE_PERFORMANCE_MSG_PENDING:
            return Object.assign({}, initialState, {loading:true});

        case ACQUIRE_PERFORMANCE_MSG_SUCCESS:
            return Object.assign({}, initialState, {performanceMsg: action.payload,loading:false});

        case ACQUIRE_PERFORMANCE_MSG_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
            };

        default:
            return state;
    }
}
