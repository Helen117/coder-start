/**
 * Created by Administrator on 2016-10-24.
 */
import api from '../../../api';
import {GET_CODE_FILES, GET_CODE_CONTENTS} from '../constants/code-files-types';

export function getCodeFile(projectId,filePath,refName) {
    var path = '/repository/tree';
    return {
        type: GET_CODE_FILES,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId,
                    treePath:filePath,
                    refName:refName
                }
            })
        }
    }
}

export function getCodeContent(projectId,filePath,refName) {
    var path = '/repository/file';
    return {
        type: GET_CODE_CONTENTS,
        payload: {
            promise: api.post(path, {
                params: {
                    projectId: projectId,
                    filePath:filePath,
                    refName:refName
                }
            })
        }
    }
}