/**
 * Created by zhaojp on 2016/10/24.
 */
import _ from 'lodash';
import {
    CREATE_VIRTUAL_GROUP_PENDING,
    CREATE_VIRTUAL_GROUP_SUCCESS,
    CREATE_VIRTUAL_GROUP_ERROR,
} from '../constants/virtual-group-action-types';

const initialState = {

};

export default function createVirtualGroup(state = initialState, action = {}) {

    switch (action.type) {
        case CREATE_VIRTUAL_GROUP_PENDING:
            return Object.assign({}, initialState, {loading:true,disabled:true});

        case CREATE_VIRTUAL_GROUP_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload,loading:false,disabled:false});

        case CREATE_VIRTUAL_GROUP_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                loading:false,
                disabled:false
            };

        default:
            return state;
    }
}