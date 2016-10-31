/**
 * Created by zhaojp on 2016/10/24.
 */
import {FETCH_PROJECT_MSG} from '../constants/virtual-group-action-types';
import api from '../../../api';

export default function fetchProjectMsg(userId) {
    var path ='/project/get-set-projects';
    return {
        type: FETCH_PROJECT_MSG,
        payload: {
            promise: api.post(path, {
                params: {
                    userId:userId
                }
            })
        }
    }
}

