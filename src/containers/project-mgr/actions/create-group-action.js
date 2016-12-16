/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import api from '../../../api';
import {CREATE_GROUP, UPDATE_GROUP, DELETE_GROUP,
    GET_GROUP_INFO_SUCCESS,
    CLEAR_GROUP_PROJECT_INFO} from '../constants/create-group-types';

export function getGroupInfo(groupInfo, selectedNode,node) {
    if (groupInfo) {
        return {
            type:GET_GROUP_INFO_SUCCESS,
            data:groupInfo,
            selectNodeData: selectedNode,
            node:node
        }
    }
}

export function clearGroupProjectInfo() {
    return {type:CLEAR_GROUP_PROJECT_INFO};
}

export function createGroup(groupData) {
    //var path = '/project-mgr/createGroup';
    var path = '/groups/create';
    return {
        type: CREATE_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function UpdateGroup(groupData) {
    var path = '/groups/update';
    return {
        type: UPDATE_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}

export function setGroupDelete(username, groupId) {
    var path = '/groups/delete';
    return {
        type: DELETE_GROUP,
        payload: {
            promise: api.post(path, {
                params: {
                    username:username,
                    groupId: groupId
                }
            })
        }
    }
}


