/**
 * Created by Administrator on 2016-09-14.
 */
import api from '../../../api';
import {PROJECT_LIST} from '../constants/list-action-types';

export function projectList(userName) {
    return {
        type: PROJECT_LIST,
        payload: {
            promise: api.post('/group',{
                data: {
                    username: userName,
                }
            })
        }
    }
}
