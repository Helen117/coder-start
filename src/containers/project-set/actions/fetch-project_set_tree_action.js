/**
 * Created by zhaojp on 2016/10/25.
 */


import {FETCH_PROJECT_SET_TREE} from '../constants/project-set-action-types';
import api from '../../../api';

export default function fetchProjectSetTree(userId) {

    var path ='/project/sets';
    //path = '/ProjectSetTree'
    return {
        type: FETCH_PROJECT_SET_TREE,
        payload: {
            promise: api.post(path, {
                params: {
                    userId:userId
                }
            })
        }
    }
}