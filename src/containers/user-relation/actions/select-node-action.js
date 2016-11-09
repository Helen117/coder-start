/**
 * Created by Administrator on 2016-11-08.
 */
import {SET_SELECT_USER_NODE} from '../constants/select-node-types';

export function getSelectNodeSuss(selectedNode,selectedUserGroup) {
    return {
        type:SET_SELECT_USER_NODE,
        selectNodeData: selectedNode,
        selectedUserGroup:selectedUserGroup
    }
}

export function getSelectNode(selectedNode,selectedUserGroup) {
    if (selectedNode) {
        return getSelectNodeSuss(selectedNode,selectedUserGroup);
    }
}