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


        default:
            return state;
    }
}