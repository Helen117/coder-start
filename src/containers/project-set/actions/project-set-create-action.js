/**
 * Created by zhaojp on 2016/10/24.
 */
import api from '../../../api';
import {CREATE_PROJECT_SET} from '../constants/project-set-action-types';

export default function createProjectSet(projectSetData) {
    var path = '/project/create-set';
    return {
        type: CREATE_PROJECT_SET,
        payload: {
            promise: api.post(path, {
                data: projectSetData
            })
        }
    }
}