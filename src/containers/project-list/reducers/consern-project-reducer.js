/**
 * Created by Administrator on 2016-09-26.
 */
import {
    CONSERN_PROJECT_PENDING,
    CONSERN_PROJECT_SUCCESS,
    CONSERN_PROJECT_ERROR,

    UNCONSERN_PROJECT_PENDING,
    UNCONSERN_PROJECT_SUCCESS,
    UNCONSERN_PROJECT_ERROR
} from '../constants/consern-action-types';

const initialState = {
};

export default function consernProject(state = initialState, action = {}) {
    switch (action.type) {
        //关注项目
        case CONSERN_PROJECT_PENDING:
            return {...state, consernedInfo:{fetchStatus: false}};
        case CONSERN_PROJECT_SUCCESS:
            return {...state, consernedInfo:{fetchStatus:true, consernedInfo:action.payload}};
        case CONSERN_PROJECT_ERROR:
            return {...state, consernedInfo:{fetchStatus: false}};
        //取消关注项目
        case UNCONSERN_PROJECT_PENDING:
            return {...state, unconsernInfo:{fetchStatus: false}};
        case UNCONSERN_PROJECT_SUCCESS:
            return {...state, unconsernInfo:{fetchStatus:true, unconsernedInfo:action.payload}};
        case UNCONSERN_PROJECT_ERROR:
            return {...state, unconsernInfo:{fetchStatus: false,}};
        default:
            return state;
    }
}