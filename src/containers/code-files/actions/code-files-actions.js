/**
 * Created by Administrator on 2016-10-24.
 */
import api from '../../../api';
import {GET_CODE_FILES, } from '../constants/code-files-types';

export function getCodeFile(projectId) {
    var path = '/fileTree';
    return {
        type: GET_CODE_FILES,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId
                }
            })
        }
    }
}