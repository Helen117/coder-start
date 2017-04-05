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
        meta: storyId,
        payload: {
            promise: api.post(path, {
                params: {
                    story_id: storyId
                }
            })
        }
    }
}

//删除task
export function deleteTask(userId,taskId) {
    var path = '/taskboard/delete-card';
    return {
        type: 'DELETE_TASK',
        payload: {
            promise: api.post(path, {
                params: {
                    user_id: userId,
                    task_id:taskId
                }
            })
        }
    }
}

//领取Task
export function setTaskDeveloper(userId,taskId) {
    var path = '/taskboard/receive-card';
    return {
        type: 'SET_TASK_DEVELOPER',
        payload: {
            promise: api.post(path, {
                params: {
                    user_id: userId,
                    task_id:taskId
                }
            })
        }
    }
}

//文档上传
export function submitTaskFile(data) {
    var path = '/taskboard/submit-card-files';
    return {
        type: 'UPLOAD_TASK_FILE',
        payload: {
            promise: api.post(path, {
                data:data
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
//回退卡片
export function rollBackCard(userId,taskId) {
    var path = '/taskboard/return-card';
    return {
        type: 'ROLL_BACK_CARD',
        payload: {
            promise: api.post(path, {
                params: {
                    user_id:userId,
                    task_id:taskId
                }
            })
        }
    }
}