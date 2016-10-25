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

export function getForks(projectId) {
    return {
        type: 'GET_FORKS',
        payload: {
            promise: api.post('/project/forks', {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}