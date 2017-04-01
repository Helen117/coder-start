/**
 * Created by Administrator on 2017/3/30.
 */
import {
    ASYNC_TREE_PROJECTSET_PENDING,
    ASYNC_TREE_PROJECTSET_SUCCESS,
    ASYNC_TREE_PROJECTSET_ERROR,

    SAVE_TREE_STATE
} from '../constants/task-board-action-types';

const initialState = {};

export default function taskBoardReducer(state = initialState, action = {}) {
    switch (action.type) {
        //获取看板项目集
        case ASYNC_TREE_PROJECTSET_PENDING:
            return {...state,getProjectSet:{loading:true,disabled:true}};
        case ASYNC_TREE_PROJECTSET_SUCCESS:
            return {...state,getProjectSet:{result: action.payload,loading:false,
                disabled:false}};
        case ASYNC_TREE_PROJECTSET_ERROR:
            return {
                ...state,getProjectSet:{loading:false, disabled:false}
            };
        //保存动态树拼接数据
        case SAVE_TREE_STATE:
            return {...state,saveTreeState:{milestone_id:action.milestone_id,
                milestoneId:action.milestoneId}};

        default:
            return state;
    }
}