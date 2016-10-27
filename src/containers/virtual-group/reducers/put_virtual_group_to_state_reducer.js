/**
 * Created by zhaojp on 2016/10/25.
 */
/**
 * Created by Administrator on 2016-09-29.
 */
import {
    PUT_VIRTUAL_GROUP_TO_STATE
} from '../constants/virtual-group-action-types';

const initialState = {
};

export default function virtualGroupToState(state = initialState, action = {}) {

    switch (action.type) {
        case PUT_VIRTUAL_GROUP_TO_STATE:
            return Object.assign({}, initialState, {selectedVirtualGroup: action.payload.data});
        default:
            return state;
    }
}
