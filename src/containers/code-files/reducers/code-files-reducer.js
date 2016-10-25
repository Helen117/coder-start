/**
 * Created by Administrator on 2016-10-24.
 */
import {
    GET_CODE_FILES_PENDING,
    GET_CODE_FILES_SUCCESS,
    GET_CODE_FILES_ERROR,
} from '../constants/code-files-types';

const initialState = {

};

export default function getCodeFile(state = initialState, action = {}) {
    switch (action.type) {
        case GET_CODE_FILES_PENDING:
            return Object.assign({}, initialState, );
        case GET_CODE_FILES_SUCCESS:
            return Object.assign({}, initialState, {codeFile: action.payload});
        case GET_CODE_FILES_ERROR:
            return {
                ...state,
                errors: action.payload.message
            };
        default:
            return state;
    }
}