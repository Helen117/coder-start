/**
 * Created by Administrator on 2016-10-13.
 */
import {
    TOP_MENU_INFO_SUCCESS, TOP_MENU_INFO_ERROR
} from '../constants/menubar-action-types';

const initialState = {};

export default function getMenuBarInfo(state = initialState, action = {}){
    switch (action.type){
        case TOP_MENU_INFO_SUCCESS:
            return Object.assign({}, initialState, {currentOne:action.data.currentOneInfo, currentTwo:action.data.currentTwoInfo});
        case TOP_MENU_INFO_ERROR:
            return {
                ...state,
                errors: action.errMessage
            };
        default:
            return state;
    }
}