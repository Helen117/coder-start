/**
 * Created by Administrator on 2016-11-18.
 */
import api from '../../../api';
import {ADD_PROJECT_MEMBER} from '../constants/project-member-types';

export function addProjectMember(addInfo) {
    var path = '/project/add-member';
    return {
        type: ADD_PROJECT_MEMBER,
        payload: {
            promise: api.post(path,{
                data: addInfo
            })
        }
    }
}