/**
 * Created by helen on 2016/12/27.
 */
export default function report(state={}, action = {}) {
    switch (action.type) {
        case 'FETCH_TO_DO_LIST_PENDING':
            return {...state, getToDoListPending:true,toDoList:null};
        case 'FETCH_TO_DO_LIST_SUCCESS':
            return {...state, toDoList: action.payload,getToDoListPending:false};
        case 'FETCH_TO_DO_LIST_ERROR':
            return {...state, toDoList:null,getToDoListPending:false,getToDoListError:action.payload.errorMsg};
        default:
            return state;
    }
}
