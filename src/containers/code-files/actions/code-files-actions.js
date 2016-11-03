/**
 * Created by Administrator on 2016-10-24.
 */
import api from '../../../api';
import {GET_CODE_FILES, } from '../constants/code-files-types';

export function getCodeFile(username) {
    var path = '/groups/user';
    return {
        type: GET_CODE_FILES,
        payload: {
            promise: api.post(path, {
                params: {
                    username: username
                }
            })
        }
    }
}