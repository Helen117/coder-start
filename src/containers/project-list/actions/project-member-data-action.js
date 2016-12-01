/**
 * Created by Administrator on 2016-11-30.
 */
import api from '../../../api';
import {GET_PROJECT_MEMBER_DATA} from '../constants/project-member-data-types';

export function getProjectMemberData(projectId) {
    var path = '/project/add-member';
    return {
        type: GET_PROJECT_MEMBER_DATA,
        payload: {
            promise: api.post(path,{
                params: {
                    projectId:projectId
                }
            })
        }
    }
}