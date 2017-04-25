/**
 * Created by Administrator on 2017/4/17.
 */
import {
    GET_BACKLOG_NODE_PENDING,
    GET_BACKLOG_NODE_SUCCESS,
    GET_BACKLOG_NODE_ERROR,

    ADD_BACKLOG_NODE_PENDING,
    ADD_BACKLOG_NODE_SUCCESS,
    ADD_BACKLOG_NODE_ERROR,

    MODIFY_BACKLOG_NODE_PENDING,
    MODIFY_BACKLOG_NODE_SUCCESS,
    MODIFY_BACKLOG_NODE_ERROR,

    DELETE_BACKLOG_NODE_PENDING,
    DELETE_BACKLOG_NODE_SUCCESS,
    DELETE_BACKLOG_NODE_ERROR,

    SAVE_CURRENT_PROJECTSET
} from '../constants/backlog-types';

const initialState = {

};

export default function backlogReducer(state = initialState, action = {}) {
    switch (action.type) {
        //获取backlog所有节点信息
        case GET_BACKLOG_NODE_PENDING:
            return {...state,getBacklogNode:{loading:true,disabled:true}};
        case GET_BACKLOG_NODE_SUCCESS:
            return {...state,getBacklogNode:{result:action.payload,loading:false,disabled:false}};
        case GET_BACKLOG_NODE_ERROR:
            return {...state,getBacklogNode:{loading:false,disabled:false}};
        //添加backlog节点
        case ADD_BACKLOG_NODE_PENDING:
            return {...state,addBacklogNode:{loading:true,disabled:true}};
        case ADD_BACKLOG_NODE_SUCCESS:
            return {...state,addBacklogNode:{result:action.payload,loading:false,disabled:false}};
        case ADD_BACKLOG_NODE_ERROR:
            return {...state,addBacklogNode:{loading:false,disabled:false}};
        //修改backlog节点
        case MODIFY_BACKLOG_NODE_PENDING:
            return {...state,modifyBacklogNode:{loading:true,disabled:true}};
        case MODIFY_BACKLOG_NODE_SUCCESS:
            return {...state,modifyBacklogNode:{result:action.payload,loading:false,disabled:false}};
        case MODIFY_BACKLOG_NODE_ERROR:
            return {...state,modifyBacklogNode:{loading:false,disabled:false}};
        //删除backlog节点
        case DELETE_BACKLOG_NODE_PENDING:
            return {...state,deleteBacklogNode:{loading:true,disabled:true}};
        case DELETE_BACKLOG_NODE_SUCCESS:
            return {...state,deleteBacklogNode:{result:action.payload,loading:false,disabled:false}};
        case DELETE_BACKLOG_NODE_ERROR:
            return {...state,deleteBacklogNode:{loading:false,disabled:false}};
        //保存当前点击的项目集
        case SAVE_CURRENT_PROJECTSET:
            return {...state,currentProjectSet:{result:action.currentProjectSet}};

        default:
            return state;
    }
}