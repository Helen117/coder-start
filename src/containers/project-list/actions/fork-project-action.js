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