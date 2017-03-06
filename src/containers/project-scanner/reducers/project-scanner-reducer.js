/**
 * Created by Administrator on 2017/2/28.
 */
import {
    SCANNER_LIST_PENDING,
    SCANNER_LIST_SUCCESS,
    SCANNER_LIST_ERROR,
    SCANNER_ITEM_PENDING,
    SCANNER_ITEM_SUCCESS,
    SCANNER_ITEM_ERROR
}from '../constants/scanner-action-types';

const initialState = {
};

export default function projectScanner(state = initialState, action = {}) {
    switch (action.type) {
        //获取项目扫描列表
        case SCANNER_LIST_PENDING:
            return {...state,scannerListInfo:{loading:true,disabled:true}};
        case SCANNER_LIST_SUCCESS:
            return {...state,scannerListInfo:{result: action.payload,loading:false,disabled:false}};
        case SCANNER_LIST_ERROR:
            return {...state,scannerListInfo:{loading:false, disabled:false}};

        //获取具体项目扫描信息
        case SCANNER_ITEM_PENDING:
            return {...state,scannerItemInfo:{loading:true,disabled:true}};
        case SCANNER_ITEM_SUCCESS:
            let responseString = action.payload;          
            let responseObject = JSON.parse(responseString);            
            return {...state,scannerItemInfo:{result:responseObject,loading:false,disabled:false}};
        case SCANNER_ITEM_ERROR:
            return {...state,scannerItemInfo:{loading:false, disabled:false}};
        default:
            return state;
    }
}