/**
 * Created by zhaojp on 2016/10/21.
 */
import api from '../../api';
import {FETCH_MR_LIST,
    FETCH_MERGE_PATH,
    FETCH_ISSUES_DATA,
    CREATE_MR} from './action-types';

export function fetchMrListData(projectId) {
    return {
        type: 'FETCH_MR_LIST',
        payload: {
            promise: api.post('/project/list-mr', {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}


export function fetchMergeBranchData(sProjectId,tProjectId,userId) {
    return {
        type: 'FETCH_MERGE_PATH',
        payload: {
            promise: api.post('/project/fork-info', {
                params: {
                    s_project_id: sProjectId,
                    t_project_id: tProjectId,
                    user_id:userId
                }
            })
        }
    }
}

export function fetchMergeAssign(projectId) {
    return {
        type: 'MR_ASSIGN',
        payload: {
            promise: api.post('/project/mr-assign', {
                params: {
                    id: projectId,
                }
            })
        }
    }
}


export function fetchIssuesData(projectId,userId) {
    var path = '/project/list-mr-issue';
    return {
        type: FETCH_ISSUES_DATA,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId:projectId,
                    userId: userId,
                }
            })
        }
    }
}

export function createMr(data) {
    return {
        type: 'CREATE_MR',
        payload: {
            promise: api.post('/project/create-mr', {
                data: data
            })
        }
    }
}
