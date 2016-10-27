/**
 * Created by helen on 2016/10/9.
 */
import api from '../../../api';

export function forkProject(projectId,username) {
    return {
        type: 'FORK_PROJECT',
        payload: {
            promise: api.post('/project/fork', {
                params: {
                    projectId: projectId,
                    username:username
                }
            })
        }
    }
}

export function getForkList(projectId) {
    return {
        type: 'GET_FORK_LIST',
        payload: {
            promise: api.post('/project/fork-list', {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}