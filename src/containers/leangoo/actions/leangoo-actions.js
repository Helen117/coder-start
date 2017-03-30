/**
 * Created by Administrator on 2017/3/30.
 */
import api from '../../../api';
import {ASYNC_TREE_PROJECTSET,
    ASYNC_TREE_PROJECTMILESTONE,
    SAVE_ASYNC_TREE_DATA} from '../constants/leangoo-action-types';

export function getAsyncProjectSet() {
    var path = '/story/sets';
    //var path = '/async-tree/projectSet';
    return {
        type: ASYNC_TREE_PROJECTSET,
        payload: {
            promise: api.post(path, {
                params: {

                }
            })
        }
    }
}

export function saveAsyncTreeData(treeData) {
    return {
        type: SAVE_ASYNC_TREE_DATA,
        treeData:treeData
    }
}