/**
 * Created by Administrator on 2016-10-10.
 */
import {
    GET_TOPNAVI_INFO_SUCCESS,
    GET_TOPNAVI_INFO_ERROR,
} from '../constants/select-topnavi-types';

const initialState = {
};

export function getTopNaviInfo(state = initialState, action = {}) {
    switch (action.type) {
        case GET_TOPNAVI_INFO_SUCCESS:
            return Object.assign({}, initialState, {TopNavi: action.data});
        case GET_TOPNAVI_INFO_ERROR:
            return {
                ...state,
                errors: action.errMessage
            };
        default:
            return state;
    }
}