/**
 * Created by Administrator on 2016-09-29.
 */
import api from '../../../api';
import {GET_GROUP_INFO_SUCCESS,
        GET_PROJECT_INFO} from '../constants/select-treenode-types';

export function getGroupInfoSuss(groupInfo, selectedNode,node) {
    return {
        type:GET_GROUP_INFO_SUCCESS,
        data:groupInfo,
        selectNodeData: selectedNode,
        node:node
    }
}

export function getGroupInfo(groupInfo, selectedNode,node) {
    if (groupInfo) {
        return getGroupInfoSuss(groupInfo, selectedNode,node);
    }
}

export function getProjectInfo(project_id,user_id) {
    var path = '/project/info';
    return {
        type: GET_PROJECT_INFO,
        payload: {
            promise: api.post(path, {
                params: {
                    project_id: project_id,
                    user_id:user_id
                }
            })
        }
    }
}


