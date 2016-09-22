/**
 * Created by helen on 2016/9/19.
 */
import api from '../../../api';

export function fetchDataSource(projectId) {
    return {
        type: 'FETCH_DATA',
        payload: {
            promise: api.post('/fetchData', {
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
            promise: api.post('/issueNotes', {
                data: {
                    id: id,
                    issue_id:issue_id
                }
            })
        }
    }
}

export function getIssueList() {
    return {
        type: 'GET_ISSUE_LIST',
        payload: {
            promise: api.post('/issue/query')
        }
    }
}

export function comment(notes) {
    console.log('notes:',notes);
    return {
        type: 'COMMENT',
        payload: {
            promise: api.post('/comment',{
                data:notes
            })
        }
    }
}