/**
 * Created by helen on 2017/3/30.
 */
import api from '../../api';

export function addTask(data) {
    var path = '/taskboard/add-card';
    return {
        type: 'ADD_TASK',
        payload: {
            promise: api.post(path, {
                data: data
            })
        }
    }
}

export function updateTask(data) {
    var path = '/taskboard/update-card';
    return {
        type: 'UPDATE_TASK',
        payload: {
            promise: api.post(path, {
                data: data
            })
        }
    }
}

export function getTaskInfo(storyId) {
    var path = '/taskboard/list-card';
    return {
        type: 'GET_TASK_INFO',
        payload: {
            promise: api.post(path, {
                params: {
                    story_id: storyId
                }
            })
        }
    }
}


export function getTaskDeveloper(storyId) {
    var path = '/taskboard/story-users';
    return {
        type: 'GET_SET_USER',
        payload: {
            promise: api.post(path, {
                params: {
                    story_id: storyId
                }
            })
        }
    }
}