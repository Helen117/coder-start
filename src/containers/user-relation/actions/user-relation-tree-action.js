/**
 * Created by Administrator on 2016-11-07.
 */
import api from '../../../api';
import {GET_USER_RELATION_TREE,} from '../constants/user-relation-tree-types';

export function getUserRelationTree(userId) {
    var path = '/userRelation';
    return {
        type: GET_USER_RELATION_TREE,
        payload: {
            promise: api.post(path, {
                params: {
                    userId: userId
                }
            })
        }
    }
}

