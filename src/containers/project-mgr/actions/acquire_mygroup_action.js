/**
 * Created by Administrator on 2016-09-23.
 */
import api from '../../../api';
import {ACQUIRE_MYGROUP} from '../constants/acquire_mygroup_types';

export function getMyGroup(username) {
    //var path = '/groups/myGroup';
    var path = '/groups/user';
    return {
        type: ACQUIRE_MYGROUP,
        payload: {
            promise: api.post(path, {
                params: {username:username}
            })
        }
    }
}