/**
 * Created by zhaojp on 2016/10/11.
 */
import _ from 'lodash';
import {
    CREATE_BRANCHES_PENDING,
    CREATE_BRANCHES_SUCCESS,
    CREATE_BRANCHES_ERROR,

    DELETE_BRANCHES_PENDING,
    DELETE_BRANCHES_SUCCESS,
    DELETE_BRANCHES_ERROR,

    FETCH_BRANCHES_PENDING,
    FETCH_BRANCHES_SUCCESS,
    FETCH_BRANCHES_ERROR,
} from './action-types';

const initialState = {
};

export default function branch(state = initialState, action = {}) {

    switch (action.type) {
        //create branch
        case CREATE_BRANCHES_PENDING:
            return {...state, createResult:null,createLoading:true};

        case CREATE_BRANCHES_SUCCESS:

            return {...state, createResult: action.payload, createLoading:false};

        case CREATE_BRANCHES_ERROR:
            return {...state, createResult:null, createLoading:false};


        //delete branch
        case DELETE_BRANCHES_PENDING:
            return {...state, deleteResult:null,deleteLoading:true};

        case DELETE_BRANCHES_SUCCESS:

            return {...state, deleteResult: action.payload, deleteLoading:false};

        case DELETE_BRANCHES_ERROR:
            return { ...state,deleteResult:null, deleteLoading:false};


        //get branch
        case FETCH_BRANCHES_PENDING:
            return {...state, getBranchLoading: true};

        case FETCH_BRANCHES_SUCCESS:
            return {...state, branchesData: action.payload, getBranchLoading: false};

        case FETCH_BRANCHES_ERROR:
            return {...state, getBranchLoading: false};

        default:
            return state;
    }
}
