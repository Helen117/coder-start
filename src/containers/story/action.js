/**
 * Created by zhaojp on 2017/3/29.
 */
import api from '../../api';
export function getStory(milestoneId) {
    console.log('调用getStory')
    const path = '/taskboard/list-story';
    return {
        type: 'GET_STORY',
        payload: {
            promise: api.post(path, {
                params: {
                    milestone_id : milestoneId
                }
            })
        }
    }
}

export function addStory(data) {
    console.log('调用addStory')
    const path = '/taskboard/add-story';
    return {
        type: 'ADD_STORY',
        payload: {
            promise: api.post(path, {
                data : data
            })
        }
    }
}

export function updateStory(data) {
    console.log('调用updateStory')
    const path = '/taskboard/update-story';
    return {
        type: 'UPDATE_STORY',
        payload: {
            promise: api.post(path, {
                data : data
            })
        }
    }
}

export function getTask(story_id) {
    const path = '/taskboard/list-card'
    return {
        type: 'GET_TASK',
        payload: {
            promise: api.post(path, {
                params: {
                    story_id : story_id
                }
            })
        }
    }
}

export function getProjectSetStaff(id,type,role) {
    return {
        type: 'GET_PROJECT_SET_STAFF',
        payload: {
            promise: api.post('/project/assign-list', {
                params: {
                    id: id,
                    type:type,
                    role:role
                }
            })
        }
    }
}