/**
 * Created by Administrator on 2016-11-30.
 */
import api from '../../../api';
import {GET_PROJECT_DATA} from '../constants/project-item-data-types';

export function getProjectItemData(projectId) {
    var path = '/project/add-member';
    return {
        type: GET_PROJECT_DATA,
        payload: {
            promise: api.post(path,{
                params: {
                    projectId:projectId
                }
            })
        }
    }
}