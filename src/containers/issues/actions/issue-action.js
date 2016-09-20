/**
 * Created by helen on 2016/9/19.
 */
import api from '../../../api';

export function fetchDataSource(projectId) {
    return {
        type: 'FETCH_DATA',
        payload: {
            promise: api.get('/fetchData', {
                data: {
                    projectId: projectId,
                    type:'0'
                }
            })
        }
    }
}


export function addIssues(projectId) {
    return {
        type: 'ADD_ISSUE',
        payload: {
            promise: api.post('/addIssue', {
                data: {
                    projectId: projectId
                }
            })
        }
    }
}

export function issueNotes(id,issue_id) {
    return {
        type: 'ISSUE_NOTES',
        payload: {
            promise: api.get('/issueNotes', {
                data: {
                    id: id,
                    issue_id:issue_id
                }
            })
        }
    }
}