/**
 * Created by Administrator on 2017-01-05.
 */
export function findMenuLink(menuKey,menuData) {
    let menuLink;
    const menuLink_temp = menuData.map((item) => {
        if(item.id == menuKey){
            return item.link;
        }else {
            return findMenuLink(menuKey,item.subMenu);
        }
    });
    for(let i=0; i<menuLink_temp.length; i++){
        if(menuLink_temp[i]){
            menuLink = menuLink_temp[i];
        }
    }
    return menuLink;
}

export function findDefaultMenuBar(menuData, navpath) {//找到默认的二级菜单和三级菜单
    let defaultMenuOne_id, defaultMenuTwo_id
    for(let i=0; i<menuData.length; i++){
        if(menuData[i].id == navpath[0].key){
            const item = menuData[i];
            if (item.subMenu.length>0){
                defaultMenuOne_id = item.subMenu[0].id;
                if (item.subMenu[0].subMenu.length==0){
                    defaultMenuTwo_id = "";
                }else{
                    defaultMenuTwo_id = item.subMenu[0].subMenu[0].id;
                }
            }else{
                defaultMenuOne_id = "";
                defaultMenuTwo_id = "";
            }
        }
    }
    return {defaultMenuOne_id, defaultMenuTwo_id}
}

export function findMenuBarInfoByLocation(menuData,pathName) {//根据url找到二级菜单和三级菜单的选中项
    let find_path = 0;
    const menuOneKey = [], menuTwoKey = [];
    for(let i=0; i<menuData.length;i++){
        if(find_path == 0){
            if(pathName == menuData[i].link){//url是一级菜单，选中项都是空
                menuOneKey[0] = "";
                menuTwoKey[0] = "";
                find_path++;
                break;
            }else if(pathName != menuData[i].link && menuData[i].subMenu.length > 0){
                const menuTwo = menuData[i].subMenu;
                for(let j=0; j<menuTwo.length; j++){
                    if(pathName == menuTwo[j].link){//url是二级菜单，继续在三级菜单中查找对应的url
                        if(menuTwo[j].subMenu.length > 0){
                            const menuTree = menuTwo[j].subMenu;
                            for(let k=0; k< menuTree.length; k++){
                                if(pathName == menuTree[k].link){//找到对应的选中项
                                    menuOneKey[0] = "menu"+menuTwo[j].id;
                                    menuTwoKey[0] = "menu"+menuTree[k].id;
                                    find_path++;
                                    break;
                                }
                            }
                        }else{
                            menuOneKey[0] = "menu"+menuTwo[j].id;
                            menuTwoKey[0] = "";
                            find_path++;
                            break;
                        }
                    }else if(pathName != menuTwo[j].link && menuTwo[j].subMenu.length > 0){
                        const menuTree = menuTwo[j].subMenu;
                        for(let k=0; k< menuTree.length; k++){
                            if(pathName == menuTree[k].link){//url是三级菜单
                                menuOneKey[0] = "menu"+menuTwo[j].id;
                                menuTwoKey[0] = "menu"+menuTree[k].id;
                                find_path++;
                                break;
                            }
                        }
                    }
                }
            }
        }else{break;}
    }
    return {menuOneKey, menuTwoKey}
}

export function findDefaultMenuThree(menuTwoKey,selectNaviOne) {//寻找默认的三级菜单
    let defaultMenuTwo_id;
    for(let i=0; i<selectNaviOne[0].subMenu.length; i++){
        if(menuTwoKey.replace("menu","") == selectNaviOne[0].subMenu[i].id){
            const selectNaviTwo = selectNaviOne[0].subMenu[i];
            if(selectNaviTwo.subMenu.length > 0){
                defaultMenuTwo_id = selectNaviTwo.subMenu[0].id;
            }else{
                defaultMenuTwo_id = "";
            }
        }
    }
    return defaultMenuTwo_id
}

export function findMenuOneIndex(menuOneKey,menuOne) {//当前点击的顶部导航一级菜单在数组中的位置
    for(let i=0; i<menuOne.length; i++){
        if(menuOneKey == menuOne[i].key.replace("menu","")){
            return i;
        }
    }
}

export function findMenuTwoIndex(menuTwoKey,currentOneInfo) {//当前点击的顶部导航二级菜单在数组中的位置
    if(currentOneInfo){
        for(let i=0; i<currentOneInfo.subMenu.length; i++){
            if(menuTwoKey == currentOneInfo.subMenu[i].id){
                return i;
            }
        }
    }
}

export function findCurrentMenuOne(menuData,navpath) {//当前点击的一级菜单
    const currentMenuOne = [];
    for(let i=0;i<menuData.length;i++){//当前点击的一级菜单
        if(navpath && navpath.length != 0){
            if(navpath[0].key == menuData[i].id){
                currentMenuOne[0] = menuData[i];
                return currentMenuOne;
            }
        }
    }
    return currentMenuOne;
}

export function findMenu(menuKey,menuData) {
    let menu;
    const menuLink_temp = menuData.map((item) => {
        if(item.id == menuKey){
            return item;
        }else {
            return findMenu(menuKey,item.subMenu);
        }
    });
    for(let i=0; i<menuLink_temp.length; i++){
        if(menuLink_temp[i]){
            menu = menuLink_temp[i];
        }
    }
    return menu;
}

export function haveSubMenu(parentMenuKey,menuData) {
    let haveSubMenu = false;
    const parentMenu = findMenu(parentMenuKey,menuData);
    if(parentMenu && parentMenu.subMenu && parentMenu.subMenu.length != 0){
        haveSubMenu = true;
    }
    return haveSubMenu;
}