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

    GET_SET_PROJECTS_SUCCESS,
    GET_SET_PROJECTS_PENDING,
    GET_SET_PROJECTS_ERROR,

    PUT_PROJECT_SET_TO_STATE,

} from './project-set-action-types';

const initialState = {
};

export function projectSet(state = initialState, action = {}) {

    switch (action.type) {
        //create project set
        case CREATE_PROJECT_SET_PENDING:
            return {...state,createResult:null, createLoading:true};

        case CREATE_PROJECT_SET_SUCCESS:
            return {...state,createResult: action.payload, createLoading:false};

        case CREATE_PROJECT_SET_ERROR:
            return {...state,createResult:null, createLoading:false};


        //update project set
        case UPDATE_PROJECT_SET_PENDING:
            return {...state,updateResult:null, updateLoading: true};

        case UPDATE_PROJECT_SET_SUCCESS:
            return {...state,updateResult: action.payload, updateLoading:false};

        case UPDATE_PROJECT_SET_ERROR:
            return {...state, updateResult:null, updateLoading: false};


        //delete project set
        case DELETE_PROJECT_SET_PENDING:
            return {...state,deleteResult:null,deleteLoading:true};

        case DELETE_PROJECT_SET_SUCCESS:
            return {...state,deleteResult: action.payload, deleteLoading:false};

        case DELETE_PROJECT_SET_ERROR:
            return {...state, deleteResult:null,deleteLoading:false,};


        //get project set tree
        case FETCH_PROJECT_SET_TREE_PENDING:
            return {...state,projectSetTree:[], getProjectSetTreeLoading: true};

        case FETCH_PROJECT_SET_TREE_SUCCESS:
            return {...state,projectSetTree: action.payload, getProjectSetTreeLoading: false};

        case FETCH_PROJECT_SET_TREE_ERROR:
            return {...state,projectSetTree:null, getProjectSetTreeLoading: false, errMessage: action.payload.errMessage};


        // get projects in set
        case GET_SET_PROJECTS_PENDING:
            return {...state,getProjectInfoLoading: true, dataSource:[], targetKeys:[]};

        case GET_SET_PROJECTS_SUCCESS:
            const targetKeys=[],dataSource=[];
            for(let i=0; i<action.payload.length; i++){
                const data = {
                    id: action.payload[i].id,
                    name: action.payload[i].name,
                };
                dataSource.push(data);
            }
            if(action.meta.editType != 'add'){
                for(let i=0; i<action.meta.selectedProjectSet.length; i++){
                    const id = action.meta.selectedProjectSet[i].id.substring(0,action.meta.selectedProjectSet[i].id.length-2);
                    const data = {
                        id: id,
                        name: action.meta.selectedProjectSet[i].name,
                    };
                    dataSource.push(data);
                    targetKeys.push(id);
                }
            }
            return {...state,projectInfo: action.payload, getProjectInfoLoading: false, dataSource:dataSource,targetKeys:targetKeys};

        case GET_SET_PROJECTS_ERROR:
            return {...state, getProjectInfoLoading: false, errMessage:action.payload.errMessage};


        // get project info
        case 'GET_PROJECT_INFORMATION_PENDING':
            return {...state, projectInfoLoading:true, projectInfo:null};
        case 'GET_PROJECT_INFORMATION_SUCCESS':
            return {...state, projectInfoLoading:false, projectInfo:action.payload};
        case 'GET_PROJECT_INFORMATION_ERROR':
            return {...state, projectInfoLoading:false, projectInfo:null};


        //create emergency project set
        case 'CREATE_EMERGENCY_PROJECT_SET_PENDING':
            return {...state,createEmergencyResult:null, createEmergencyLoading:true};

        case 'CREATE_EMERGENCY_PROJECT_SET_SUCCESS':
            return {...state,createEmergencyResult: action.payload, createEmergencyLoading:false};

        case 'CREATE_EMERGENCY_PROJECT_SET_ERROR':
            return {...state,createEmergencyResult:null, createEmergencyLoading:false};

        //put selected tree item to state
        case PUT_PROJECT_SET_TO_STATE:
            return {...state, selectedProjectSet: action.payload.data};

        default:
            return state;
    }
}



