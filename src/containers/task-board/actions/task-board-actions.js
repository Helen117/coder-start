/**
 * Created by Administrator on 2017/3/30.
 */
import api from '../../../api';
import {ASYNC_TREE_PROJECTSET,
    SAVE_TREE_STATE} from '../constants/task-board-action-types';

export function getAsyncProjectSet(user_id) {
    var path = '/taskboard/sets';
    //var path = '/async-tree/projectSet';
    return {
        type: ASYNC_TREE_PROJECTSET,
        payload: {
            promise: api.post(path, {
                params: {
                    user_id:user_id
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