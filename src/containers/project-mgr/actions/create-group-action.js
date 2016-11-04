/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import api from '../../../api';
import {CREATE_GROUP, UPDATE_GROUP, DELETE_GROUP} from '../constants/create-group-types';

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


