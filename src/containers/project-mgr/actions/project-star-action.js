/**
 * Created by Administrator on 2016-09-27.
 */
import api from '../../../api';
import {GET_PROJECTSTAR, } from '../constants/project-star-types';

export function getProjectStar(username) {
    var path = '/project/star-list';
    //var path = 'http://10.10.156.110:11000/gitlab/groups/all';
    //var path = '/groups/all';
    return {
        type: GET_PROJECTSTAR,
        payload: {
            promise: api.post(path, {
                params: {
                    username: username
                }
            })
        }
    }
}