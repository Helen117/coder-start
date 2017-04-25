/**
 * Created by Administrator on 2017/4/17.
 */
import api from '../../../api';
import {
    GET_BACKLOG_NODE,
    ADD_BACKLOG_NODE,
    MODIFY_BACKLOG_NODE,
    DELETE_BACKLOG_NODE,
    SAVE_CURRENT_PROJECTSET
} from '../constants/backlog-types';

export function getBacklogNode(set_id,user_id) {
    var path = '/mindmap/list-node';
    return {
        type: GET_BACKLOG_NODE,
        payload: {
            promise: api.post(path, {
                params: {
                    set_id:set_id,
                    user_id:user_id
                }
            })
        }
    }
}

export function addBacklogNode(data) {
    var path = '/mindmap/add-node';
    return {
        type: ADD_BACKLOG_NODE,
        payload: {
            promise: api.post(path, {
                data:data
            })
        }
    }
}

export function modifyBacklogNode(data) {
    var path = '/mindmap/update-node';
    return {
        type: MODIFY_BACKLOG_NODE,
        payload: {
            promise: api.post(path, {
                data:data
            })
        }
    }
}


export function deleteBacklogNode(data) {
    var path = '/mindmap/delete-node';
    return {
        type: DELETE_BACKLOG_NODE,
        payload: {
            promise: api.post(path, {
                data:data
            })
        }
    }
}

export function saveCurrentProjectset(currentProjectSet) {
    return {
        type: SAVE_CURRENT_PROJECTSET,
        currentProjectSet:currentProjectSet
    }
}