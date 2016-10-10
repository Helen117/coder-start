/**
 * Created by Administrator on 2016-10-10.
 */
import {GET_TOPNAVI_INFO_SUCCESS,
    GET_TOPNAVI_INFO_ERROR} from '../constants/select-topnavi-types';

export function getTopNaviSuss(topNaviInfo) {
    return {
        type:GET_TOPNAVI_INFO_SUCCESS,
        data:topNaviInfo
    }
}

export function getTopNaviFail() {
    return {
        type:GET_TOPNAVI_INFO_ERROR,
        errMessage:"未选中任何顶部菜单!"
    }
}

export function getTopNaviInfo(topNaviInfo) {
    return (dispatch) => {
        if(topNaviInfo){
            dispatch(getTopNaviSuss(topNaviInfo));
        }else{
            dispatch(getTopNaviFail());
        }
    }
}