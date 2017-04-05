/**
 * Created by helen on 2017/3/30.
 */
// import {cloneObject}  from '../../utils/common';

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
            var taskInfo = cloneObject(state.taskInfo);
            taskInfo[action.meta] = {...action.payload, loading:false};
            return {...state, ...taskInfo };
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

 function cloneObject(object) {
    var bak;
    if (object instanceof(Array)) {
        bak = [];
        for (var i =0; i< object.length; i++) {
            if (typeof object[i] == "object") arguments.callee(object[i]);
            else bak[i] = object[i];
        }
    } else {
        bak = {};
        for (var key in object) {
            if (typeof bak[key] == "object") {
                arguments.callee(bak[key]);
            } else { // 包括函数在内 直接赋值了
                bak[key] = object[key];
            }
        }
    }
    return bak;
}
