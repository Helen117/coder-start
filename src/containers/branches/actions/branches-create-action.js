/**
 * Created by zhaojp on 2016/10/11.
 */
import api from '../../../api';
import {CREATE_BRANCHES} from '../constants/action-types';

export default function createBranch(data) {
    return {
        type: 'CREATE_BRANCHES',
        payload: {
            promise: api.post('/project/add-branch', {
                data: data
            })
        }
    }
}