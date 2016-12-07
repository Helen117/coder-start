/**
 * Created by zhaojp on 2016/10/24.
 */
import _ from 'lodash';
import {
    CREATE_PROJECT_SET_PENDING,
    CREATE_PROJECT_SET_SUCCESS,
    CREATE_PROJECT_SET_ERROR,

    UPDATE_PROJECT_SET_PENDING,
    UPDATE_PROJECT_SET_SUCCESS,
    UPDATE_PROJECT_SET_ERROR,

    DELETE_PROJECT_SET_PENDING,
    DELETE_PROJECT_SET_SUCCESS,
    DELETE_PROJECT_SET_ERROR,

    FETCH_PROJECT_SET_TREE_SUCCESS,
    FETCH_PROJECT_SET_TREE_PENDING,
    FETCH_PROJECT_SET_TREE_ERROR,

    FETCH_PROJECT_INFO_SUCCESS,
    FETCH_PROJECT_INFO_PENDING,
    FETCH_PROJECT_INFO_ERROR,

} from './project-set-action-types';

const initialState = {
};

export function projectSet(state = initialState, action = {}) {

    switch (action.type) {
        //create project set
        case CREATE_PROJECT_SET_PENDING:
            return {...state, createLoading:true};

        case CREATE_PROJECT_SET_SUCCESS:
            return {...state,createResult: action.payload, createLoading:false};

        case CREATE_PROJECT_SET_ERROR:
            return {...state,createLoading:false};


        //update project set
        case UPDATE_PROJECT_SET_PENDING:
            return {...state,updateLoading: true};

        case UPDATE_PROJECT_SET_SUCCESS:
            return {...state,updateResult: action.payload, updateLoading:false};

        case UPDATE_PROJECT_SET_ERROR:
            return {...state, updateLoading: false};


        //delete project set
        case DELETE_PROJECT_SET_PENDING:
            return {...state,deleteLoading:true};

        case DELETE_PROJECT_SET_SUCCESS:
            return {...state,deleteResult: action.payload, deleteLoading:false};

        case DELETE_PROJECT_SET_ERROR:
            return {...state, deleteLoading:false,};


        //get project set tree
        case FETCH_PROJECT_SET_TREE_PENDING:
            return {...state,getProjectSetTreeLoading: true};

        case FETCH_PROJECT_SET_TREE_SUCCESS:
            return {...state,projectSetTree: action.payload, getProjectSetTreeLoading: false};

        case FETCH_PROJECT_SET_TREE_ERROR:
            return {...state,getProjectSetTreeLoading: false, errMessage: action.payload.errMessage};


        // get project info
        case FETCH_PROJECT_INFO_PENDING:
            return {...state,getProjectInfoLoading: true};

        case FETCH_PROJECT_INFO_SUCCESS:
            return {...state,projectInfo: action.payload, getProjectInfoLoading: false};

        case FETCH_PROJECT_INFO_ERROR:
            return {...state, getProjectInfoLoading: false, errMessage:action.payload.errMessage};


        default:
            return state;
    }
}



