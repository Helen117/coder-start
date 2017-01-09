/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/18
 */
import api from '../../../api';
import {GET_GROUP_TREE, SET_SELECT_NODE} from '../constants/group-tree-types';

export function getGroupTree(userId) {
    var path = '/groups/user';
    return {
        type: GET_GROUP_TREE,
        payload: {
            promise: api.post(path, {
                params: {
                    userId: userId
                }
            })
        }
    }
}

export function setSelectNode(nodeInfo) {
    return {
        type: SET_SELECT_NODE,
        meta: nodeInfo
    }
}

