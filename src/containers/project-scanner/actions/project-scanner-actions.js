/**
 * Created by Administrator on 2017/2/28.
 */
import api from '../../../api';
import {
    SCANNER_LIST,
    SCANNER_ITEM
} from '../constants/scanner-action-types';

export function getScannerList(projectsIdName,metricKeys) {
    var path = '/sonar/list';
    return {
        type: SCANNER_LIST,
        payload: {
            promise: api.post(path, {
                params: {
                    projectsIdName: projectsIdName,
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