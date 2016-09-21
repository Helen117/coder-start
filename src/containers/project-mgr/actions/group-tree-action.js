/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/18
 */
import api from '../../../api';
import {GET_GROUP_TREE} from '../constants/group-tree-types';

export function getGroupTree(userId) {
    var path = '/project-mgr/groupTree';
    //var path = 'http://10.10.156.110:11000/gitlab/groups/all';
    return {
        type: GET_GROUP_TREE,
        payload: {
            promise: api.post(path, {
                data: {
                    userId: userId
                }
            })
        }
    }
}
