/**
 * Created by Administrator on 2017/3/30.
 */
import {
    ASYNC_TREE_PROJECTSET_PENDING,
    ASYNC_TREE_PROJECTSET_SUCCESS,
    ASYNC_TREE_PROJECTSET_ERROR,

    ASYNC_TREE_PROJECTMILESTONE_PENDING,
    ASYNC_TREE_PROJECTMILESTONE_SUCCESS,
    ASYNC_TREE_PROJECTMILESTONE_ERROR,

    SAVE_ASYNC_TREE_DATA
} from '../constants/leangoo-action-types';

const initialState = {};

export default function leangooReducer(state = initialState, action = {}) {
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
        //动态加载项目集下里程碑
        case ASYNC_TREE_PROJECTMILESTONE_PENDING:
            return {...state,getProjectMilestone:{loading:true,disabled:true}};
        case ASYNC_TREE_PROJECTMILESTONE_SUCCESS:
            return {...state,getProjectMilestone:{result: action.payload,loading:false,
                disabled:false}};
        case ASYNC_TREE_PROJECTMILESTONE_ERROR:
            return {
                ...state,getProjectMilestone:{loading:false, disabled:false}
            };
        //保存动态树拼接数据
        case SAVE_ASYNC_TREE_DATA:
            return {...state,saveTreeData:{result:action.treeData}};

        default:
            return state;
    }
}