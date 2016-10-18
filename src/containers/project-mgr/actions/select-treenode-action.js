/**
 * Created by Administrator on 2016-09-29.
 */
import {GET_GROUP_INFO_SUCCESS,
        GET_GROUP_INFO_ERROR,
        GET_PROJECT_INFO_SUCCESS,
        GET_PROJECT_INFO_ERROR} from '../constants/select-treenode-types';

export function getGroupInfoSuss(groupInfo, selectedNode) {
    return {
        type:GET_GROUP_INFO_SUCCESS,
        data:groupInfo,
        selectNodeData: selectedNode
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

export function getGroupInfo(groupInfo, selectedNode) {
        if (groupInfo) {
            return getGroupInfoSuss(groupInfo, selectedNode);
        } else {
            return getGroupInfoFail();
        }
}

export function getProjectInfo(projectInfo) {
    if(projectInfo){
        return getProjectInfoSuss(projectInfo);
    }else{
        return getProjectInfoFail();
    }
}


