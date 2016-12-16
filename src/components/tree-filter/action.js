/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/12/6
 */
export const SET_SELECTED_NODE_KEY = 'SET_SELECTED_NODE_KEY';
export const SET_FILTER_VALUE = 'SET_FILTER_VALUE';
export const SET_FIRE_ON_EXPAND = 'SET_FIRE_ON_EXPAND';

export function setSelectedNodeKey(selectedNodeKey, busiType) {
    return {
        type: SET_SELECTED_NODE_KEY,
        selectedNodeKey: selectedNodeKey,
        busiType: busiType
    }
}

export function setFilterValue(filterValue, fireOnExpand, busiType) {
    return {
        type: SET_FILTER_VALUE,
        filterValue: filterValue,
        fireOnExpand: fireOnExpand,
        busiType: busiType
    }
}

export function setFireOnExpand(expandedKeys, fireOnExpand, busiType) {
    return {
        type: SET_FIRE_ON_EXPAND,
        expandedKeys: expandedKeys,
        fireOnExpand: fireOnExpand,
        busiType: busiType
    }

}
