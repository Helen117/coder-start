/**
 * Created by Administrator on 2016-11-08.
 */
import {SET_SELECT_USER_NODE} from '../constants/select-node-types';

export function getSelectNodeSuss(selectedNode) {
    return {
        type:SET_SELECT_USER_NODE,
        selectNodeData: selectedNode
    }
}

export function getSelectNode(selectedNode) {
    if (selectedNode) {
        return getSelectNodeSuss(selectedNode);
    }
}