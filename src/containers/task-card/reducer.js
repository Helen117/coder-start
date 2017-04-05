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

        case 'SET_TASK_DEVELOPER_PENDING':
            return {...state, setTaskDeveloper:null,setTaskDeveloperLoading:true};
        case 'SET_TASK_DEVELOPER_SUCCESS':
            return {...state, setTaskDeveloper:action.payload, setTaskDeveloperLoading:false};
        case 'SET_TASK_DEVELOPER_ERROR':
            return {
                ...state,
                setTaskDeveloperErrors: action.payload.errorMsg,
                setTaskDeveloper:null,
                setTaskDeveloperLoading:false
            };


        case 'GET_TASK_INFO_PENDING':
            return {...state, taskInfo:{loading:true}};
        case 'GET_TASK_INFO_SUCCESS':
            // var taskInfo = Object.assign({}, state.taskInfo);
            // taskInfo[action.mete] = {...action.payload, loading:false};
            //
            // return {...state, ...taskInfo };
            return {...state,taskInfo:{...action.payload,loading:false}};
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
        //回退卡片
        case 'ROLL_BACK_CARD_PENDING':
            return {...state, rollBackInfo:{loading:true}};
        case 'ROLL_BACK_CARD_SUCCESS':
            // var taskInfo = Object.assign({}, state.taskInfo);
            // taskInfo[action.mete] = {...action.payload, loading:false};
            //
            // return {...state, ...taskInfo };
            return {...state,rollBackInfo:{result:action.payload,loading:false}};
        case 'ROLL_BACK_CARD_ERROR':
            return {
                ...state, rollBackInfo:{loading:false}
            };

        default:
            return state;
    }
}