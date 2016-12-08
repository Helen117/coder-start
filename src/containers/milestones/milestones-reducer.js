/**
 * Created by zhaojp on 2016/9/14.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES_SUCCESS,
    ACQUIRE_MILESTONES_PENDING,
    ACQUIRE_MILESTONES_ERROR,

    PUT_MILESTONES_PROID,
    PUT_MILESTONES_PROID_ERROR,

    CREATE_MILESTONES_PENDING,
    CREATE_MILESTONES_SUCCESS,
    CREATE_MILESTONES_ERROR,

    UPDATE_MILESTONES_PENDING,
    UPDATE_MILESTONES_SUCCESS,
    UPDATE_MILESTONES_ERROR,

    ACQUIRE_MILESTONES_ISSUES_PENDING,
    ACQUIRE_MILESTONES_ISSUES_SUCCESS,
    ACQUIRE_MILESTONES_ISSUES_ERROR
} from './milestones-action-types';

const initialState = {
};

export function milestones(state = initialState, action = {}) {

        switch (action.type) {

            //acquire milestones
            case ACQUIRE_MILESTONES_PENDING:
                return {...state, acqMilestoneLoading: true, acquireData:false};
    
            case ACQUIRE_MILESTONES_SUCCESS:
                return {...state, milestones: action.payload, acqMilestoneLoading: false};
            
            case ACQUIRE_MILESTONES_ERROR:
            return {...state,acqMilestoneLoading: false, acquireData:false};

            
            //put milestone's project_id into state
            case PUT_MILESTONES_PROID:
                return {...state, milestoneProId: action.data};

            case PUT_MILESTONES_PROID_ERROR:
                return {...state, errors: action.errMessage};
                
                
            //create milestone
            case CREATE_MILESTONES_PENDING:
                return {...state,createResult:null,createLoading:true};

            case CREATE_MILESTONES_SUCCESS:
                return {...state, createResult: action.payload,createLoading:false};

            case CREATE_MILESTONES_ERROR:
                return { ...state, createResult:null,createLoading:false };


            //update milestone
            case UPDATE_MILESTONES_PENDING:
                return {...state,updateResult:null,updateLoading:true};

            case UPDATE_MILESTONES_SUCCESS:
                return {...state,updateResult: action.payload,updateLoading:false};

            case UPDATE_MILESTONES_ERROR:
                return {...state, updateResult:null,updateLoading:false };

                
            //get milestone issues
            case ACQUIRE_MILESTONES_ISSUES_PENDING:
                return {...state,milestoneIssues:[],acqIssuesLoading: true};

            case ACQUIRE_MILESTONES_ISSUES_SUCCESS:
                return {...state,milestoneIssues: action.payload, acqIssuesLoading: false};

            case ACQUIRE_MILESTONES_ISSUES_ERROR:
                return {...state, milestoneIssues:[],acqIssuesLoading: false};


            default:
                return state;
    }
}


