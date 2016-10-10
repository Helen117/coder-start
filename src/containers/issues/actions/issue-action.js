/**
 * Created by helen on 2016/9/19.
 */
import api from '../../../api';

export function fetchDataSource(projectId) {
    return {
        type: 'FETCH_DATA',
        payload: {
            promise: api.post('/project/assign', {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}


export function addIssues(issues) {
    console.log('commit issue:',issues);
    return {
        type: 'ADD_ISSUE',
        payload: {
            promise: api.post('/project/add-issue', {
                data:issues
            })
        }
    }
}

export function issueNotes(projectId,issueId) {
    return {
        type: 'ISSUE_NOTES',
        payload: {
            promise: api.post('/issue/notes', {
                params: {
                    projectId: projectId,
                    issueId:issueId
                }
            })
        }
    }
}

export function getIssueList(projectId) {
    return {
        type: 'GET_ISSUE_LIST',
        payload: {
            promise: api.post('/project/issues',{
                params: {
                    projectId: projectId
                }
            })
        }
    }
}

export function comment(notes) {
    console.log('notes:',notes);
    return {
        type: 'COMMENT',
        payload: {
            promise: api.post('/issue/add-note',{
                data:notes
            })
        }
    }
}

export function closeIssue(issueId) {
    return {
        type: 'CLOSEISSUE',
        payload: {
            promise: api.post('/issue/close',{
                params: {
                    issueId: issueId
                }
            })
        }
    }
}