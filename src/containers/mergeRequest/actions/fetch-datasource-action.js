/**
 * Created by zhaojp on 2016/10/8.
 */
import api from '../../../api';
import {FETCH_DATA,FETCH_NAMESPACE} from '../constants/action-types';

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
/*
export function fetchNamespace(projectId) {
    return {
        type: 'FETCH_NAMESPACE',
        payload: {
            promise: api.post('/project/assign', {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}*/
