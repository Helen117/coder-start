/**
 * Created by Administrator on 2017/3/30.
 */
import {
    ASYNC_TREE_PROJECTSET_PENDING,
    ASYNC_TREE_PROJECTSET_SUCCESS,
    ASYNC_TREE_PROJECTSET_ERROR,

    SAVE_TREE_STATE,

    TASKBOARD_MILESTONE_PENDING,
    TASKBOARD_MILESTONE_SUCCESS,
    TASKBOARD_MILESTONE_ERROR
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
                milestoneId:action.milestoneId,selectedKeys:action.selectedKeys}};

        //获取项目集下里程碑
        case TASKBOARD_MILESTONE_PENDING:
            return {...state,projectSetMilestone:{loading:true,disabled:true}};
        case TASKBOARD_MILESTONE_SUCCESS:
            return {...state,projectSetMilestone:{result: action.payload,loading:false,
                disabled:false}};
        case TASKBOARD_MILESTONE_ERROR:
            return {
                ...state,projectSetMilestone:{loading:false, disabled:false}
            };

        default:
            return state;
    }
}