/**
 * Created by zhaojp on 2017/3/29.
 */
const initialState = {
};

export default function story(state = initialState, action = {}) {
    switch (action.type) {
        //get task and joint data
        case 'GET_TASK_PENDING':
            return {...state, getTaskLoading: true, };
        case 'GET_TASK_SUCCESS':
            const currentTaskData = action.payload;
            const story = state.story;
            for(let i=0; i<story.length; i++){
                if(story[i].id == currentTaskData.story_id){
                    story[i].taskData = currentTaskData;
                    break;
                }
            }
            return {...state, story: story, currentTaskData:action.payload,getTaskLoading: false};
        case 'GET_TASK_ERROR':
            return {...state, getTaskLoading: false};


        //get story
        case 'GET_STORY_PENDING':
            return {...state, story:null,getStoryLoading: true};
        case 'GET_STORY_SUCCESS':
            return {...state, story:action.payload, getStoryLoading: false};
        case 'GET_STORY_ERROR':
            return {...state, getStoryLoading: false};

        case 'ADD_STORY_PENDING':
            return {...state, addStoryLoading: true};
        case 'ADD_STORY_SUCCESS':
            return {...state, addStory:action.payload, addStoryLoading: false};
        case 'ADD_STORY_ERROR':
            return {...state, addStoryLoading: false};

        case 'UPDATE_STORY_PENDING':
            return {...state, updateStoryLoading: true};
        case 'UPDATE_STORY_SUCCESS':
            return {...state,updateStory:action.payload, updateStoryLoading: false};
        case 'UPDATE_STORY_ERROR':
            return {...state, updateStoryLoading: false};
            
        default:
            return state;

    }
}