/**
 * Created by Administrator on 2016-12-04.
 */
import api from '../../../api';
import {GET_USER_RELATION_TREE,
    SET_SELECT_USER_NODE,
    GET_USER_INFO,
    MOVE_USER,DELETE_GROUP_USER,
    CREATE_USER_GROUP,UPDATE_USER_GROUP,DELETE_USER_GROUP} from '../constants/user-relation-types';

//获取组织树
export function getUserRelationTree(userId) {
    var path = '/service-groups/list';
    return {
        type: GET_USER_RELATION_TREE,
        payload: {
            promise: api.post(path, {
                params: {
                    userId:userId
                }
            })
        }
    }
}
//点击树节点
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
//获取人员信息
export function getUserInfo(group_id) {
    var path = '/service-groups/users';
    return {
        type: GET_USER_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    group_id: group_id
                }
            })
        }
    }
}
//移动人员
export function MoveUser(groupData) {
    var path = '/service-groups/move-group-user';
    return {
        type: MOVE_USER,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}
//删除人员组织关系
export function DeleteGroupUser(groupData) {
    var path = '/service-groups/delete-group-user';
    return {
        type: DELETE_GROUP_USER,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}
//新建组织
export function createUserGroup(groupData) {
    var path = '/service-groups/add';
    return {
        type: CREATE_USER_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}
//修改组织
export function UpdateUserGroup(groupData) {
    var path = '/service-groups/update';
    return {
        type: UPDATE_USER_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}
//删除组织
export function setUserGroupDelete(group_id, user_id) {
    var path = '/service-groups/delete';
    return {
        type: DELETE_USER_GROUP,
        payload: {
            promise: api.post(path, {
                params: {
                    user_id:user_id,
                    group_id: group_id
                }
            })
        }
    }
}