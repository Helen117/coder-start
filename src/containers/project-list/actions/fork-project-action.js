/**
 * Created by helen on 2016/10/9.
 */
import api from '../../../api';

export function forkProject(projectId,username,namesapce) {
    return {
        type: 'FORK_PROJECT',
        payload: {
            promise: api.post('/project/fork', {
                params: {
                    projectId: projectId,
                    username:username,
                    namesapce:namesapce
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

export function getNamespace(userId) {
    return {
        type: 'GET_NAMESPACE',
        payload: {
            promise: api.post('/project/fork-path', {
                params: {
                    userId: userId
                }
            })
        }
    }
}