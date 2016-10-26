/**
 * Created by Administrator on 2016-09-29.
 */
import api from '../../../api';
import {GET_GROUP_INFO_SUCCESS,
        GET_PROJECT_INFO} from '../constants/select-treenode-types';

export function getGroupInfoSuss(groupInfo, selectedNode) {
    return {
        type:GET_GROUP_INFO_SUCCESS,
        data:groupInfo,
        selectNodeData: selectedNode
    }
}

export function getGroupInfo(groupInfo, selectedNode) {
        if (groupInfo) {
            return getGroupInfoSuss(groupInfo, selectedNode);
        }
}

export function getProjectInfo(projectId) {
    var path = '/project/info';
    return {
        type: GET_PROJECT_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}


