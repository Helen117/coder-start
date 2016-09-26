/**
 * Created by Administrator on 2016-09-26.
 */
import api from '../../../api';
import {CONSERN_PROJECT, UNCONSERN_PROJECT} from '../constants/consern-action-types';

export function consernProject(starInfo) {
    console.log("starInfo:",starInfo);
    var path = '/project/star';
    return {
        type: CONSERN_PROJECT,
        payload: {
            promise: api.post(path,{
                params: {
                    username: starInfo.username,
                    projectId:starInfo.projectId
                }
            })
        }
    }
}

export function unconsernProject(starInfo) {
    var path = '/project/unstar';
    return {
        type: UNCONSERN_PROJECT,
        payload: {
            promise: api.post(path,{
                params: {
                    username: starInfo.username,
                    projectId:starInfo.projectId
                }
            })
        }
    }
}