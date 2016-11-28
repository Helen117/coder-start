/**
 * Created by zhaojp on 2016/11/28.
 */
import { GET_CONFIRM_LIST_PENDING ,
    GET_CONFIRM_LIST_SUCCESS ,
    GET_CONFIRM_LIST_ERROR
} from '../constants/to-be-confirmed-action-types';

const initialState = {
};

export function getConfirmList(state = initialState, action = {}) {

    switch (action.type) {

        case GET_CONFIRM_LIST_PENDING:
            return Object.assign({}, initialState, {loading: true, items:[], acquireData:false, errMessage:null});

        case GET_CONFIRM_LIST_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload, loading: false, errMessage:null});

        case GET_CONFIRM_LIST_ERROR:
            return {state, errMessage: action.payload.errorMsg,items: [], loading: false, acquireData:false};

        default:
            return state;
    }
}