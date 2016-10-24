/**
 * Created by zhaojp on 2016/10/24.
 */
import api from '../../../api';
import {CREATE_VIRTUAL_GROUP} from '../constants/virtual-group-action-types';

export function createVirtualGroup(virtualGroupData) {
    var path = '';
    return {
        type: CREATE_VIRTUAL_GROUP,
        payload: {
            promise: api.post(path, {
                data: virtualGroupData
            })
        }
    }
}