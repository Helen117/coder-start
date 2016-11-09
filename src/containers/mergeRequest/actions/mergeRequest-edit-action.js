/**
 * Created by zhaojp on 2016/10/10.
 */
import api from '../../../api';
import {CREATE_MR,ACCEPT_MR,CLOSE_MR} from '../constants/action-types';

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


export function acceptMr(project_id,id) {
    return {
        type: 'ACCEPT_MR',
        payload: {
            promise: api.post('/project/accept-mr', {
                params:{
                    project_id: project_id,
                    id: id,
                    merge_commit_message:'123'
                }
            })
        }
    }
}


export function closeMr(project_id,id) {
    return {
        type: 'CLOSE_MR',
        payload: {
            promise: api.post('/project/close-mr', {
                params:{
                    project_id: project_id,
                    id: id
                }
            })
        }
    }
}