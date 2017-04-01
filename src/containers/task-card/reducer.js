/**
 * Created by helen on 2017/3/30.
 */
export default function taskCard(state = {}, action = {}) {
    switch (action.type) {

        case 'ADD_TASK_PENDING':
            return {...state, result:{getLoading:true}};
        case 'ADD_TASK_SUCCESS':
            return {...state, result: {...action.payload, getLoading:false}};
        case 'ADD_TASK_ERROR':
            return {
                ...state,
                errors: action.payload.errorMsg,
                result:{getLoading:false}
            };

        case 'UPDATE_TASK_PENDING':
            return {...state, updateTask:null,updateTaskLoading:true};
        case 'UPDATE_TASK_SUCCESS':
            return {...state, updateTask:action.payload, updateTaskLoading:false};
        case 'UPDATE_TASK_ERROR':
            return {
                ...state,
                updateTaskErrors: action.payload.errorMsg,
                updateTask:null,
                updateTaskLoading:false
            };


        case 'GET_TASK_INFO_PENDING':
            return {...state, taskInfo:{loading:true}};
        case 'GET_TASK_INFO_SUCCESS':
            return {...state, taskInfo: {...action.payload, loading:false}};
        case 'GET_TASK_INFO_ERROR':
            return {
                ...state,
                errorInfo: action.payload.errorMsg,
                taskInfo:{loading:false}
            };

        case 'GET_SET_USER_PENDING':
            return {...state, getUserLoading:true};
        case 'GET_SET_USER_SUCCESS':
            return {...state, userInfo: action.payload, getUserLoading:false};
        case 'GET_SET_USER_ERROR':
            return {
                ...state,
                getUserError: action.payload.errorMsg,
                getUserLoading:false
            };


        default:
            return state;
    }
}