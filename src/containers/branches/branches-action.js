/**
 * Created by zhaojp on 2016/11/1.
 */

import api from '../../api';
import {FETCH_BRANCHES, DELETE_BRANCHES, CREATE_BRANCHES} from './action-types';

export function fetchBranchesData(projectId) {
    return {
        type: 'FETCH_BRANCHES',
        payload: {
            promise: api.post('/project/branches', {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}

export function createBranch(data) {
    return {
        type: 'CREATE_BRANCHES',
        payload: {
            promise: api.post('/project/add-branch', {
                data: data
            })
        }
    }
}

export function deleteBranch(branch,project_id,result,username) {
    return {
        type: 'DELETE_BRANCHES',
        payload: {
            promise: api.post('/project/delete-branch', {
                params: {
                    branch_name: branch,
                    project_id: project_id,
                    result: result,
                    username: username
                }

            })
        }
    }
}


