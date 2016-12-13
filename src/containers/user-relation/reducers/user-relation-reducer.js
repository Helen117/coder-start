/**
 * Created by Administrator on 2016-12-04.
 */
import {
    GET_USER_RELATION_TREE_PENDING,
    GET_USER_RELATION_TREE_SUCCESS,
    GET_USER_RELATION_TREE_ERROR,
    SET_SELECT_USER_NODE,
    GET_USER_INFO_PENDING,
    GET_USER_INFO_SUCCESS,
    GET_USER_INFO_ERROR,
    MOVE_USER_PENDING,
    MOVE_USER_SUCCESS,
    MOVE_USER_ERROR,
    DELETE_GROUP_USER_PENDING,
    DELETE_GROUP_USER_SUCCESS,
    DELETE_GROUP_USER_ERROR,
    CREATE_USER_GROUP_PENDING,
    CREATE_USER_GROUP_SUCCESS,
    CREATE_USER_GROUP_ERROR,
    UPDATE_USER_GROUP_PENDING,
    UPDATE_USER_GROUP_SUCCESS,
    UPDATE_USER_GROUP_ERROR,
    DELETE_USER_GROUP_PENDING,
    DELETE_USER_GROUP_SUCCESS,
    DELETE_USER_GROUP_ERROR,
    SELECTED_ROW_KEYS,
    GET_USER_LEADER_PENDING,
    GET_USER_LEADER_SUCCESS,
    GET_USER_LEADER_ERROR
} from '../constants/user-relation-types';
import {CLEAR_USER_RELATION_INFO} from '../../project-list/constants/project-member-types';

const initialState = {
    userInfoData:[]
};
const initState = {};

export default function UserRelation(state = initialState, action = {}) {
    switch (action.type) {
        //获取组织树数据
        case GET_USER_RELATION_TREE_PENDING:
            return {...state, getUserRelationTree:{loading: true}};
        case GET_USER_RELATION_TREE_SUCCESS:
            return {...state, getUserRelationTree:{loading: false, userTreeData: action.payload}};
        case GET_USER_RELATION_TREE_ERROR:
            return {
                ...state,getUserRelationTree:{loading: false}
            };
        //点击树节点
        case SET_SELECT_USER_NODE:
            return {...state, getSelectNode:{selectedNode: action.selectNodeData,
                selectedUserGroup:action.selectedUserGroup}};
        //获取人员信息
        case GET_USER_INFO_PENDING:
            if (!state[action.meta]){
                state['getUserInfo_'+action.meta] = Object.assign({}, initState);//等同于={...initState}
            }
            state['getUserInfo_'+action.meta].loading = true;
            return {...state};
        case GET_USER_INFO_SUCCESS:
            if (!state[action.meta]){
                state['getUserInfo_'+action.meta] = Object.assign({}, initState);//等同于={...initState}
            }
            state['getUserInfo_'+action.meta].loading = false;
            state['getUserInfo_'+action.meta].userInfoData = action.payload;
            return {...state};
        case GET_USER_INFO_ERROR:
            if (!state[action.meta]){
                state['getUserInfo_'+action.meta] = Object.assign({}, initState);//等同于={...initState}
            }
            state['getUserInfo_'+action.meta].loading = false;
            return {
                ...state,getUserInfo:{loading: false}
            };
        //移动人员
        case MOVE_USER_PENDING:
            return {...state, moveUserRelation:{moveLoading:true,moveDisabled:true}};
        case MOVE_USER_SUCCESS:
            return {...state, moveUserRelation:{moveResult: action.payload,moveLoading:false,
            moveDisabled:false}};
        case MOVE_USER_ERROR:
            return {
                ...state,moveUserRelation:{moveLoading:false, moveDisabled:false,}
            };
        //删除人员组织关系
        case DELETE_GROUP_USER_PENDING:
            return {...state, deleteUserRelation:{deleteLoading:true,deleteDisabled:true}};
        case DELETE_GROUP_USER_SUCCESS:
            return {...state, deleteUserRelation:{deleteResult: action.payload,deleteLoading:false,
            deleteDisabled:false}};
        case DELETE_GROUP_USER_ERROR:
            return {
                ...state,deleteUserRelation:{deleteLoading:false, deleteDisabled:false,}
            };
        //新建组织
        case CREATE_USER_GROUP_PENDING:
            return {...state, createUserGroup:{loading:true,disabled:true}};
        case CREATE_USER_GROUP_SUCCESS:
            return {...state, createUserGroup:{result: action.payload,loading:false,disabled:false}};
        case CREATE_USER_GROUP_ERROR:
            return {
                ...state,createUserGroup:{loading:false, disabled:false,}
            };
        //修改组织
        case UPDATE_USER_GROUP_PENDING:
            return {...state, updateUserGroup:{updateLoading:true,updateDisabled:true}};
        case UPDATE_USER_GROUP_SUCCESS:
            return {...state, updateUserGroup:{updateResult: action.payload,updateLoading:false,updateDisabled:false}};
        case UPDATE_USER_GROUP_ERROR:
            return {
                ...state,updateUserGroup:{updateLoading:false, updateDisabled:false,}
            };
        //删除组织
        case DELETE_USER_GROUP_PENDING:
            return {...state,deleteUserGroup:{deleteLoading:true}};
        case DELETE_USER_GROUP_SUCCESS:
            return {...state, deleteUserGroup:{deleteResult: action.payload,deleteLoading:false}};
        case DELETE_USER_GROUP_ERROR:
            return {...state,deleteUserGroup:{deleteLoading:false}};
        //清除user_relation相关信息
        case CLEAR_USER_RELATION_INFO:
            return initialState;
        //保存table的selectedRowKeys
        case SELECTED_ROW_KEYS:
            if (!state[action.busi_type]){
                state['selectedKeys_'+action.busi_type] = Object.assign({}, initState);//等同于={...initState}
            }
            state['selectedKeys_'+action.busi_type].selectedKeys = action.selectedRowKeys;
            return {...state};
        //非领导数据
        case GET_USER_LEADER_PENDING:
            return {...state,notLeaderInfo:{loading:true}};
        case GET_USER_LEADER_SUCCESS:
            return {...state, notLeaderInfo:{notLeaderInfo: action.payload,loading:false}};
        case GET_USER_LEADER_ERROR:
            return {...state,notLeaderInfo:{loading:false}};
        default:
            return state;
    }
}