/**
 * Created by Administrator on 2016-10-21.
 */
import api from '../../../api';
import {GET_PROJECTMEMBERS, } from '../constants/project-members-types';

export function getProjectMembers(projectId) {
    var path = '/project/members';
    //var path = 'http://10.10.156.110:11000/gitlab/groups/all';
    //var path = '/groups/all';
    return {
        type: GET_PROJECTMEMBERS,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}