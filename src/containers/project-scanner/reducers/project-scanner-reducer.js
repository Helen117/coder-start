/**
 * Created by Administrator on 2017/2/28.
 */
import {
    SCANNER_LIST_PENDING,
    SCANNER_LIST_SUCCESS,
    SCANNER_LIST_ERROR,
    SCANNER_ITEM_PENDING,
    SCANNER_ITEM_SUCCESS,
    SCANNER_ITEM_ERROR,
    PROJECTS_KEYS_PENDING,
    PROJECTS_KEYS_SUCCESS,
    PROJECTS_KEYS_ERROR,
    PROJECT_HAS_SCANED_PENDING,
    PROJECT_HAS_SCANED_SUCCESS,
    PROJECT_HAS_SCANED_ERROR
}from '../constants/scanner-action-types';

const initialState = {
};

export default function projectScanner(state = initialState, action = {}) {
    switch (action.type) {
        //获取项目扫描列表
        case SCANNER_LIST_PENDING:
            return {...state,scannerListInfo:{loading:true,disabled:true}};
        case SCANNER_LIST_SUCCESS:
            let listResponseString = action.payload;
            let listResponseObject = JSON.parse(listResponseString);
            return {...state,scannerListInfo:{result: listResponseObject,loading:false,disabled:false}};
        case SCANNER_LIST_ERROR:
            return {...state,scannerListInfo:{loading:false, disabled:false}};

        //获取具体项目扫描信息
        case SCANNER_ITEM_PENDING:
            return {...state,scannerItemInfo:{loading:true,disabled:true}};
        case SCANNER_ITEM_SUCCESS:
            let itemResponseString = action.payload;
            let itemResponseObject = JSON.parse(itemResponseString);
            return {...state,scannerItemInfo:{result:itemResponseObject,loading:false,disabled:false}};
        case SCANNER_ITEM_ERROR:
            return {...state,scannerItemInfo:{loading:false, disabled:false}};
        //获取扫描过的项目key
        case PROJECTS_KEYS_PENDING:
            return {...state,scannerKeysInfo:{loading:true,disabled:true}};
        case PROJECTS_KEYS_SUCCESS:
            return {...state,scannerKeysInfo:{result:action.payload,loading:false,disabled:false}};
        case PROJECTS_KEYS_ERROR:
            return {...state,scannerKeysInfo:{loading:false, disabled:false}};
        //检查项目是否被扫描过
        case PROJECT_HAS_SCANED_PENDING:
            return {...state,hasScanedInfo:{loading:true,disabled:true}};
        case PROJECT_HAS_SCANED_SUCCESS:
            return {...state,hasScanedInfo:{result:action.payload,loading:false,disabled:false}};
        case PROJECT_HAS_SCANED_ERROR:
            return {...state,hasScanedInfo:{loading:false, disabled:false}};
        default:
            return state;
    }
}