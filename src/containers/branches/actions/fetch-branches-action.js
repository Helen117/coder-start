/**
 * Created by zhaojp on 2016/10/11.
 */
import api from '../../../api';
import {FETCH_BRANCHES} from '../constants/action-types';

export default function fetchBranchesData(projectId) {
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