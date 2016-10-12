/**
 * Created by zhaojp on 2016/10/10.
 */
import api from '../../../api';
import {CREATE_MR} from '../constants/action-types';

export default function createMr(data) {
    return {
        type: 'CREATE_MR',
        payload: {
            promise: api.post('/project/create-mr', {
                data: data
            })
        }
    }
}