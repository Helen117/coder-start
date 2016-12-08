/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/12/6
 */
import {
    SET_SELECTED_NODE_KEY,
    SET_FILTER_VALUE,
    SET_FIRE_ON_EXPAND
} from './action';

const initialState = {
    //selectedNodeKey:[]
};
const initState = {
    selectedNodeKey: [],
    expandedKeys: [],
    filterValue: '',
    fireOnExpand: false
};

export default function treeFilter(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SELECTED_NODE_KEY:
            if (!state[action.busiType]){
                state[action.busiType] = Object.assign({}, initState);//等同于={...initState}
            }
            state[action.busiType].selectedNodeKey = action.selectedNodeKey;
            return {
                ...state
            };
        case SET_FILTER_VALUE:
            if (!state[action.busiType]){
                state[action.busiType] = Object.assign({}, initState);
            }
            state[action.busiType].filterValue = action.filterValue;
            state[action.busiType].fireOnExpand = action.fireOnExpand;
            return {
                ...state
            };
        case SET_FIRE_ON_EXPAND:
            if (!state[action.busiType]){
                state[action.busiType] = Object.assign({}, initState);
            }
            state[action.busiType].expandedKeys = action.expandedKeys;
            state[action.busiType].fireOnExpand = action.fireOnExpand;
            return {
                ...state
            };
        default:
            return state;
    }
}
