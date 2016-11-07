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
    return {
        type: 'ADD_ISSUE',
        payload: {
            promise: api.post('/project/add-issue', {
                data:issues
            })
        }
    }
}

export function updateIssue(issue) {
    return {
        type: 'UPDATE_ISSUE',
        payload: {
            promise: api.post('/project/update-issue',{
                data:issue
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

export function getIssueList(projectId,milestoneId) {
    return {
        type: 'GET_ISSUE_LIST',
        payload: {
            promise: api.post('/project/project-issues',{
                params: {
                    projectId: projectId,
                    milestoneId: milestoneId
                }
            })
        }
    }
}

export function comment(notes) {
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

export function delIssue(projectId,issueId) {
    return {
        type: 'DELETE_ISSUE',
        payload: {
            promise: api.post('/issue/delete',{
                params: {
                    projectId: projectId,
                    issueId: issueId
                }
            })
        }
    }
}

export function getIssueDemand(projectId,milestoneId) {
    return {
        type: 'GET_DEMAND',
        payload: {
            promise: api.post('/project/demand-issues',{
                params: {
                    project_id: projectId,
                    milestone_id:milestoneId
                }
            })
        }
    }
}