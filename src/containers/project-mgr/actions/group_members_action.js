/**
 * Created by Administrator on 2016-09-23.
 */
import api from '../../../api';
import {GET_GROUPMEMBERS, } from '../constants/group_members_types';

export function getGroupMembers(groupId) {
    var path = '/groups/members';
    //var path = 'http://10.10.156.110:11000/gitlab/groups/all';
    //var path = '/groups/all';
    return {
        type: GET_GROUPMEMBERS,
        payload: {
            promise: api.post(path, {
                params: {
                    groupId: groupId
                }
            })
        }
    }
}