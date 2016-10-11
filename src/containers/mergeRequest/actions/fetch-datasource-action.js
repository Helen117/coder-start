/**
 * Created by zhaojp on 2016/10/8.
 */
import api from '../../../api';
import {FETCH_DATA,FETCH_NAMESPACE} from '../constants/action-types';

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
export function fetchTargetProData(projectId) {
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
