/**
 * Created by Administrator on 2016-11-08.
 */
import {
    SET_SELECT_USER_NODE
} from '../constants/select-node-types';

const initialState = {
};

export default function getSelectNode(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SELECT_USER_NODE:
            return Object.assign({}, initialState, {selectedNode: action.selectNodeData});
        default:
            return state;
    }
}