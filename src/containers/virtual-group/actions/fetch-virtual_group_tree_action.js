/**
 * Created by zhaojp on 2016/10/25.
 */


import {FETCH_VIRTUAL_GROUP_TREE} from '../constants/virtual-group-action-types';
import api from '../../../api';

export default function fetchVirtualGroupTree(userId) {

    var path ='/project/sets';
    //path = '/virtualGroupTree'
    return {
        type: FETCH_VIRTUAL_GROUP_TREE,
        payload: {
            promise: api.post(path, {
                params: {
                    userId:userId
                }
            })
        }
    }
}