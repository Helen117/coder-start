/**
 * Created by Administrator on 2016-12-02.
 */
import {
    UPDATE_USER_INFO_PENDING,
    UPDATE_USER_INFO_SUCCESS,
    UPDATE_USER_INFO_ERROR,

    GET_ALL_USER_INFO_PENDING,
    GET_ALL_USER_INFO_SUCCESS,
    GET_ALL_USER_INFO_ERROR,

    ADD_SSHKEY_PENDING,
    ADD_SSHKEY_SUCCESS,
    ADD_SSHKEY_ERROR,

    GET_SSHKEYS_PENDING,
    GET_SSHKEYS_SUCCESS,
    GET_SSHKEYS_ERROR,

    DELETE_SSHKEYS_PENDING,
    DELETE_SSHKEYS_SUCCESS,
    DELETE_SSHKEYS_ERROR
} from '../constants/update-user-info-types';

const initialState = {
};

export default function UpdateUserInfo(state = initialState, action = {}) {
    switch (action.type) {
        //更新基本信息、密码
        case UPDATE_USER_INFO_PENDING:
            return {...state, UserInfo:{updateLoading:true,updateDisabled:true}};
        case UPDATE_USER_INFO_SUCCESS:
            return {...state, UserInfo:{updateResult: action.payload,updateLoading:false,
            updateDisabled:false}};
        case UPDATE_USER_INFO_ERROR:
            return {
                ...state,
                UserInfo:{updateLoading:false,
                    updateDisabled:false,}
            };
        //获取所有用户信息
        case GET_ALL_USER_INFO_PENDING:
            return {...state, AllUserInfo:{allUserloading: true}};
        case GET_ALL_USER_INFO_SUCCESS:
            return {...state, AllUserInfo:{allUserloading: false, allUserInfo: action.payload}};
        case GET_ALL_USER_INFO_ERROR:
            return {
                ...state,
                AllUserInfo:{allUserloading: false}
            };
        //添加sshkey
        case ADD_SSHKEY_PENDING:
            return {...state, AddSshkey:{addLoading:true,addDisabled:true}};
        case ADD_SSHKEY_SUCCESS:
            return {...state, AddSshkey:{addResult: action.payload,addLoading:false,
            addDisabled:false}};
        case ADD_SSHKEY_ERROR:
            return {
                ...state,
                AddSshkey:{addLoading:false, addDisabled:false,}
            };
        //删除sshkey
        case DELETE_SSHKEYS_PENDING:
            return {...state, DeleteSshkey:{deleteLoading:true,deleteDisabled:true}};
        case DELETE_SSHKEYS_SUCCESS:
            return {...state, DeleteSshkey:{deleteResult: action.payload,deleteLoading:false,
            deleteDisabled:false}};
        case DELETE_SSHKEYS_ERROR:
            return {
                ...state,
                DeleteSshkey:{deleteLoading:false,deleteDisabled:false,}
            };
        //获取sshkey
        case GET_SSHKEYS_PENDING:
            return {...state, GetSshkey:{getLoading:true,getDisabled:true}};
        case GET_SSHKEYS_SUCCESS:
            return {...state, GetSshkey:{getResult: action.payload,getLoading:false,
            getDisabled:false}};
        case GET_SSHKEYS_ERROR:
            return {
                ...state,
                GetSshkey:{getLoading:false,getDisabled:false,}
            };
        default:
            return state;
    }
}