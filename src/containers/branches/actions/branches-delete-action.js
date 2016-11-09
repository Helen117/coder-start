/**
 * Created by zhaojp on 2016/11/1.
 */
import api from '../../../api';
import {DELETE_BRANCHES} from '../constants/action-types';

export default function deleteBranch(branch,project_id,result) {
    return {
        type: 'DELETE_BRANCHES',
        payload: {
            promise: api.post('/project/delete-branch', {
                params: {
                    branch_name: branch,
                    project_id: project_id,
                    result: result
                }

            })
        }
    }
}