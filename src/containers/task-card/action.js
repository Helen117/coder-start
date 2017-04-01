/**
 * Created by helen on 2017/3/30.
 */
import api from '../../api';

export function addTask(data) {
    var path = '/addTask';
    return {
        type: 'ADD_TASK',
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


export function getTaskDeveloper(setsId,storyId) {
    var path = '/getTask';
    return {
        type: 'GET_TASK_INFO',
        payload: {
            promise: api.post(path, {
                params: {
                    setsId:setsId,
                    story_id: storyId
                }
            })
        }
    }
}