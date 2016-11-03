/**
 * Created by Administrator on 2016-10-13.
 */
import {TOP_MENU_INFO_SUCCESS, TOP_MENU_INFO_ERROR} from '../constants/menubar-action-types';

export function getMenuBarInfoSuss(currentOneInfo,currentTwoInfo) {
    return {
        type:TOP_MENU_INFO_SUCCESS,
        data:{currentOneInfo, currentTwoInfo}
    }
}

export function getMenuBarInfoFail() {
    return {
        type:TOP_MENU_INFO_ERROR,
        errMessage:"未选中任何菜单!"
    }
}


export function getMenuBarInfo(currentOneInfo, currentTwoInfo) {
    // return (dispatch) => {
    //     /*if(currentOneInfo){*/
    //         console.log("888");
    //         dispatch(getMenuBarInfoSuss(currentOneInfo));
    //     /*}else{
    //         dispatch(getMenuBarInfoFail());
    //     }*/
    // }
    if (currentOneInfo){
        return getMenuBarInfoSuss(currentOneInfo, currentTwoInfo);
    }else{
        return getMenuBarInfoFail();
    }
}