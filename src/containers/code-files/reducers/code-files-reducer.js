/**
 * Created by Administrator on 2016-10-24.
 */
import {
    GET_CODE_FILES_PENDING,
    GET_CODE_FILES_SUCCESS,
    GET_CODE_FILES_ERROR,

    GET_CODE_CONTENTS_PENDING,
    GET_CODE_CONTENTS_SUCCESS,
    GET_CODE_CONTENTS_ERROR
} from '../constants/code-files-types';

const initialState = {

};

export default function getCodeFile(state = initialState, action = {}) {
    switch (action.type) {
        case GET_CODE_FILES_PENDING:
            return Object.assign({}, initialState, {fetchCodeStatus:false,loadingFile:true});
        case GET_CODE_FILES_SUCCESS:
            return Object.assign({}, initialState, { fetchCodeStatus:true,codeFile: action.payload,
                loadingFile:false});
        case GET_CODE_FILES_ERROR:
            return {
                ...state,
                errors: action.payload.message,
                fetchCodeStatus:false,
                loadingFile:false
            };
        case GET_CODE_CONTENTS_PENDING:
            return Object.assign({}, initialState, {fetchContentStatus:false,loadingContent:true});
        case GET_CODE_CONTENTS_SUCCESS:
            return Object.assign({}, initialState, { fetchContentStatus:true,codeView: action.payload,
                loadingContent:false});
        case GET_CODE_CONTENTS_ERROR:
            return {
                ...state,
                errors: action.payload.errorMsg,
                fetchContentStatus:false,
                loadingContent:false
            };
        default:
            return state;
    }
}