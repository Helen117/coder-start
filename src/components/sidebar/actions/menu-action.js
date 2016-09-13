/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

import api from '../../../api';
import {UPDATE_NAVPATH, GET_ALL_MENU} from '../constants/menu-action-types';

export function updateNavPath(path, key) {
    return {
        type: UPDATE_NAVPATH,
        payload: {
            data: path,
            key: key
        }
    }
}

export function getAllMenu(id) {
    var path = '/user/' + id + '/menu';
    return {
        type: GET_ALL_MENU,
        payload: {
            promise: api.get(path)
        }
    }
}
