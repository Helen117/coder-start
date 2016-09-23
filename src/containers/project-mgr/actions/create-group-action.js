/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import api from '../../../api';
import {CREATE_GROUP} from '../constants/create-group-types';

export function createGroup(groupData) {
    //var path = '/project-mgr/createGroup';
    var path = '/groups/create';
    console.log("groupData:",groupData);
    return {
        type: CREATE_GROUP,
        payload: {
            promise: api.post(path, {
                data: groupData
            })
        }
    }
}


