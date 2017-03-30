/**
 * Created by zhaojp on 2017/3/29.
 */
import api from '../../api';
export function getStory(milestoneId) {
    console.log('调用action')
    const path = '/leangoo/list-story';
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

export function getTask(story_id) {
    const path = '/leangoo/list-card'
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