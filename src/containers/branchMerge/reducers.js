/**
 * Created by zhaojp on 2017/1/3.
 */
import {
    PUSH_CODE_TO_MASTER_PENDING ,
    PUSH_CODE_TO_MASTER_SUCCESS,
    PUSH_CODE_TO_MASTER_ERROR,

    PUSH_CODE_TO_RELEASE_PENDING ,
    PUSH_CODE_TO_RELEASE_SUCCESS,
    PUSH_CODE_TO_RELEASE_ERROR,} from './action-types'
const initialState = {
};

export default function branchMerge(state = initialState, action = {}) {
    switch (action.type) {

        case 'PUSH_CODE_TO_MASTER_PENDING':
            return {...state, codeToMasterResult: null, codeToMasterLoading: true};
        case 'PUSH_CODE_TO_MASTER_SUCCESS':
            return {...state, codeToMasterResult: action.payload, codeToMasterLoading: false};
        case 'PUSH_CODE_TO_MASTER_ERROR':
            return {...state, codeToMasterResult: null, codeToMasterLoading: false};

            
        case 'PUSH_CODE_TO_RELEASE_PENDING':
            return {...state, codeToReleaseResult: null, codeToReleaseLoading: true};
        case 'PUSH_CODE_TO_RELEASE_SUCCESS':
            return {...state, codeToReleaseResult: action.payload, codeToReleaseLoading: false};
        case 'PUSH_CODE_TO_RELEASE_ERROR':
            return {...state, codeToReleaseResult: null, codeToReleaseLoading: false};

        default: return {...state}
    }
}