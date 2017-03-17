/**
 * Created by Administrator on 2017/2/28.
 */
import api from '../../../api';
import {
    SCANNER_LIST,
    SCANNER_ITEM,
    PROJECTS_KEYS,
    PROJECT_HAS_SCANED
} from '../constants/scanner-action-types';

export function getScannerList(projectKeys,metricKeys) {
    var path = '/sonar/list';
    return {
        type: SCANNER_LIST,
        payload: {
            promise: api.post(path, {
                params: {
                    projectKeys: projectKeys,
                    metricKeys:metricKeys
                }
            })
        }
    }
}

export function getScannerItem(componentKey,metricKeys) {
    var path = '/sonar/item';
    return {
        type: SCANNER_ITEM,
        payload: {
            promise: api.post(path, {
                params: {
                    componentKey: componentKey,
                    metricKeys:metricKeys
                }
            })
        }
    }
}

export function getProjectsKeys(projectsIdName) {
    var path = '/sonar/projectsKeys';
    return {
        type: PROJECTS_KEYS,
        payload: {
            promise: api.post(path, {
                params: {
                    projectsIdName: projectsIdName,
                }
            })
        }
    }
}

export function projectsHasScaned(projectKey) {
    var path = '/sonar/hasScaned';
    return {
        type: PROJECT_HAS_SCANED,
        payload: {
            promise: api.post(path, {
                params: {
                    projectKey: projectKey,
                }
            })
        }
    }
}