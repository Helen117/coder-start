/**
 * Created by Administrator on 2017/3/30.
 */
import api from '../../../api';
import {ASYNC_TREE_PROJECTSET,
    SAVE_TREE_STATE} from '../constants/task-board-action-types';

export function getAsyncProjectSet() {
    var path = '/taskboard/sets';
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

export function saveAsyncTreeState(selectedKeys,milestone_id,milestoneId) {
    return {
        type: SAVE_TREE_STATE,
        milestone_id:milestone_id,
        milestoneId:milestoneId,
        selectedKeys:selectedKeys
    }
}