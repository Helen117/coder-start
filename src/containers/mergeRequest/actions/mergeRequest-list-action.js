/**
 * Created by zhaojp on 2016/10/21.
 */
import api from '../../../api';
import {FETCH_MR_LIST} from '../constants/action-types';

export default function fetchMrListData(projectId) {
    console.log('调用action',projectId)
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