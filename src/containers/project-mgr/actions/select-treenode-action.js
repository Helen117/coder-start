/**
 * Created by Administrator on 2016-09-29.
 */
import {GET_GROUP_INFO_SUCCESS,
        GET_GROUP_INFO_ERROR,
        GET_PROJECT_INFO_SUCCESS,
        GET_PROJECT_INFO_ERROR} from '../constants/select-treenode-types';

export function getGroupInfoSuss(groupInfo) {
    return {
        type:GET_GROUP_INFO_SUCCESS,
        data:groupInfo
    }
}

export function getGroupInfoFail() {
    return {
        type:GET_GROUP_INFO_ERROR,
        errMessage:"未选中任何组!"
    }
}

export function getProjectInfoSuss(projectInfo) {
    return {
        type:GET_PROJECT_INFO_SUCCESS,
        data:projectInfo
    }
}

export function getProjectInfoFail() {
    return {
        type:GET_PROJECT_INFO_ERROR,
        errMessage:"未选中任何项目!"
    }
}

export function getGroupInfo(groupInfo) {
    return (dispatch) => {
        if (groupInfo) {
            dispatch(getGroupInfoSuss(groupInfo));
        } else {
            dispatch(getGroupInfoFail());
        }
    }
}

export function getProjectInfo(projectInfo) {
    return (dispatch) => {
        if(projectInfo){
            dispatch(getProjectInfoSuss(projectInfo));
        }else{
            dispatch(getProjectInfoFail());
        }
    }
}


