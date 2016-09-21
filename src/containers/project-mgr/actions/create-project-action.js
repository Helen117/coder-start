/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import api from '../../../api';
import {CREATE_PROJECT} from '../constants/create-project-types';

export function createProject(projectData) {
    var path = '/project-mgr/createProject';
    return {
        type: CREATE_PROJECT,
        payload: {
            promise: api.post(path, {
                data: projectData
            })
        }
    }
}
