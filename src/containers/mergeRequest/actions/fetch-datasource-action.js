/**
 * Created by zhaojp on 2016/10/8.
 */
import api from '../../../api';
import {FETCH_DATA,FETCH_TARGET_PROJECT,FETCH_ISSUES_DATA} from '../constants/action-types';

export function fetchSourceProData(projectId) {
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

export function fetchMergeBranchData(projectId) {
    return {
        type: 'FETCH_TARGET_PROJECT',
        payload: {
            promise: api.post('/project/fork-info', {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}

export function fetchIssuesData(milestonesId,projectId) {
    var path ='/milestone/issues'
    return {
        type: FETCH_ISSUES_DATA,
        payload: {
            promise: api.post(path, {
                params: {
                    milestoneId:milestonesId,
                    projectId:projectId
                }
            })
        }
    }
}
