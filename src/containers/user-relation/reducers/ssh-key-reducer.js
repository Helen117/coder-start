/**
 * Created by Administrator on 2016-11-18.
 */
import {
    ADD_SSHKEY_PENDING,
    ADD_SSHKEY_SUCCESS,
    ADD_SSHKEY_ERROR
} from '../constants/ssh-key-types';

const initialState = {
};

export default function AddSshKey(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_SSHKEY_PENDING:
            return Object.assign({}, initialState, {addLoading:true,addDisabled:true});
        case ADD_SSHKEY_SUCCESS:
            return Object.assign({}, initialState, {addResult: action.payload,addLoading:false,
                moveDisabled:false});
        case ADD_SSHKEY_ERROR:
            return {
                ...state,
                addErrors: action.payload.errorMsg,
                addLoading:false,
                addDisabled:false,
            };
        default:
            return state;
    }
}