/**
 * Created by Administrator on 2016-10-11.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { Menu, Icon } from 'antd';
import {getMenuBarInfo} from './actions/menubar-action';
import 'pubsub-js';
import './index.less';

let currentOne,currentTwo,topMenuOne_temp=[];
//let selectNaviOne = [];

class MenuBar extends React.Component {
    constructor(){
        super();
        this.selectNaviOne=[];
        this.state = {
            currentMenuOne:"",
            currentMenuTwo:"",
            refreshMenuOne:false,
            windowLocation:""
        }
    }

    findDefaultMenuBar(menuData, navpath){
        let defaultMenuOne_id, defaultMenuTwo_id
        for(let i=0; i<menuData.length; i++){
            if(menuData[i].id == navpath[0].key){
                let item = menuData[i];
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

    findMenuBarInfoByLocation(menuData,pathName){//根据url找到二级菜单和三级菜单的选中项
        let find_path = 0, menuOneKey = [], menuTwoKey = [];
        for(let i=0; i<menuData.length;i++){
            if(find_path == 0){
                if(pathName == menuData[i].link){//url是一级菜单，选中项都是空
                    menuOneKey[0] = "";
                    menuTwoKey[0] = "";
                    find_path++;
                    break;
                }else if(pathName != menuData[i].link && menuData[i].subMenu.length > 0){
                    let menuTwo = menuData[i].subMenu;
                    for(let j=0; j<menuTwo.length; j++){
                        if(pathName == menuTwo[j].link){//url是二级菜单，继续在三级菜单中查找对应的url
                            if(menuTwo[j].subMenu.length > 0){
                                let menuTree = menuTwo[j].subMenu;
                                for(let k=0; k< menuTree.length; k++){
                                    if(pathName == menuTree[k].link){//找到对应的选中项
                                        menuOneKey[0] = "menu"+menuTwo[j].id;
                                        menuTwoKey[0] = "menu"+menuTree[k].id;
                                        find_path++;
                                        break;
                                    }
                                }
                            }
                        }else if(pathName != menuTwo[j].link && menuTwo[j].subMenu.length > 0){
                            let menuTree = menuTwo[j].subMenu;
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

    componentWillReceiveProps(nextProps){
        const {navpath, menuData} = nextProps;
        if(navpath.length != 0){
            if(this.props.navpath != navpath && navpath ){
                if(nextProps.is_menuclick == true){//点击侧边导航，顶部导航恢复默认值
                    let {defaultMenuOne_id, defaultMenuTwo_id} = this.findDefaultMenuBar(menuData, navpath);
                    this.setState({
                        refreshMenuOne:true,
                        currentMenuOne:"menu"+defaultMenuOne_id,
                        currentMenuTwo:"menu"+defaultMenuTwo_id,
                    })
                }else{//登录、刷新、返回操作更新顶部导航
                    //根据url找到当前页面顶部导航的selectKeys
                    let {menuOneKey, menuTwoKey} = this.findMenuBarInfoByLocation(menuData,window.location.pathname);
                    let oneKey_return,twoKey_return;
                    if(menuOneKey.length>0 && menuTwoKey.length>0){
                        oneKey_return = menuOneKey[0],twoKey_return = menuTwoKey[0];
                    }
                    let truePath = window.location.pathname;
                    while(!oneKey_return && !twoKey_return && menuOneKey.length == 0){//如果没有找到key,去掉最后一个“/”，继续找
                        let trueIndex = truePath.lastIndexOf("/");
                        if(trueIndex == 0){
                            oneKey_return = currentOne[0];
                            twoKey_return = currentTwo[0];
                        }else{
                            truePath = truePath.substr(0,trueIndex);
                            let {menuOneKey, menuTwoKey} = this.findMenuBarInfoByLocation(menuData,truePath);
                            oneKey_return = menuOneKey[0];
                            twoKey_return = menuTwoKey[0];
                        }
                    }
                    this.setState({
                        refreshMenuOne:true,
                        currentMenuOne:oneKey_return,
                        currentMenuTwo:twoKey_return,
                    })
                }
            }
        }
    }

    isEmptyObject(obj){
        for(let key in obj){
            return false;
        }
        return true;
    }

    componentDidUpdate(){
        //获取顶部导航的一级、二级菜单当前选中项，放到state中，用于点击项目树时，停留在当前页面
        let currentOneInfo = {},currentTwoInfo = {};
        if(currentOne.length > 0){
            let currentOne_temp = currentOne[0].replace("menu","");
            let menuOneIndex = this.findMenuOneIndex(currentOne_temp,topMenuOne_temp[0]);
            currentOneInfo = this.selectNaviOne[0].subMenu[menuOneIndex];
            if(currentTwo.length > 0){
                let currentTwo_temp = currentTwo[0].replace("menu","");
                let menuTwoIndex = this.findMenuTwoIndex(currentTwo_temp, currentOneInfo);
                if(currentOneInfo){
                    currentTwoInfo = currentOneInfo.subMenu[menuTwoIndex];
                }
            }
        }
        this.props.menuBarInfo(currentOneInfo,currentTwoInfo);
    }

    findDefaultMenuThree(menuTwoKey){
        let defaultMenuTwo_id;
        for(let i=0; i<this.selectNaviOne[0].subMenu.length; i++){
            if(menuTwoKey.replace("menu","") == this.selectNaviOne[0].subMenu[i].id){
                let selectNaviTwo = this.selectNaviOne[0].subMenu[i];
                if(selectNaviTwo.subMenu.length > 0){
                    defaultMenuTwo_id = selectNaviTwo.subMenu[0].id;
                }else{
                    defaultMenuTwo_id = "";
                }
            }
        }
        return {defaultMenuTwo_id}
    }

    clickMenuOne(e){
        //待修改内容，当点击二级菜单时，要默认展示三级菜单的第一个
        let currentMenuTwo = this.findDefaultMenuThree(e.key);
        this.setState({
            refreshMenuOne:false,
            currentMenuOne:e.key,
            currentMenuTwo:"menu"+currentMenuTwo
        })
    }
    clickMenuTwo(e){
        this.setState({
            refreshMenuOne:false,
            currentMenuTwo:e.key,
        })
    }

    findMenuOneIndex(menuOneKey,menuOne){//当前点击的顶部导航一级菜单在数组中的位置
        for(let i=0; i<menuOne.length; i++){
            if(menuOneKey == menuOne[i].key.replace("menu","")){
                return i;
            }
        }
    }

    findMenuTwoIndex(menuTwoKey,currentOneInfo){//当前点击的顶部导航二级菜单在数组中的位置
        if(currentOneInfo){
            for(let i=0; i<currentOneInfo.subMenu.length; i++){
                if(menuTwoKey == currentOneInfo.subMenu[i].id){
                    return i;
                }
            }
        }
    }

    render(){
        const {menuData, navpath} = this.props;
        for(let i=0;i<menuData.length;i++){//当前点击的一级菜单
            if(navpath.length != 0){
                if(navpath[0].key == menuData[i].id){
                    this.selectNaviOne[0] = menuData[i];
                }
            }
        }
        const topMenu = this.selectNaviOne.map((item) => {//顶部一级导航，结构[[{},{},{}]]
            let menuone_null = [];
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    let topMenuData = item.subMenu;
                    const menuOneData = topMenuData.map(( itemTop ) => {
                        let link;
                        if(itemTop.subMenu.length > 0){
                            link = itemTop.subMenu[0].link;
                        }else{
                            link = itemTop.link;
                        }
                        return (
                            <Menu.Item key={'menu' + itemTop.id}>
                                <Link to={link}>{itemTop.name}</Link>
                            </Menu.Item>
                        )
                    })
                    return menuOneData;
                }else{return menuone_null;}
            }else{return menuone_null;}
        });
        let topMenu_1=[];
        if(topMenu.length > 0){//顶部一级导航，结构[[{},{},{}]]
            if(topMenu[0].length > 0){
                topMenu_1[0] = topMenu[0];
                topMenuOne_temp[0] = topMenu_1[0];
            }
        }
        const topMenuTwo = this.selectNaviOne.map((item) => {//顶部二级导航,结构[[[{},{},{}],[{},{}],[{}]]]
            let menutwo_null = [];
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    let topMenuData = item.subMenu;
                    const topTwoMenu = topMenuData.map((itemTopTwo) => {
                        if(itemTopTwo.subMenu){
                            if(itemTopTwo.subMenu.length != 0){
                                let menuTwoData = itemTopTwo.subMenu;
                                const topTwo = menuTwoData.map((itemTwo) => {
                                    let menuTwoKey = 'menu'+itemTwo.id;
                                    return (
                                        <Menu.Item key={menuTwoKey}>
                                            <Link to={itemTwo.link}>{itemTwo.name}</Link>
                                        </Menu.Item>
                                    )
                                });
                                return topTwo;
                            }else{return menutwo_null;}
                        }else{return menutwo_null;}
                    });
                    return topTwoMenu;
                }else{return menutwo_null;}
            }else{return menutwo_null;}
        });
        let haveMenuOne = false;
        let haveMenuTwo = false;
        if(this.selectNaviOne.length != 0){
            if(this.selectNaviOne[0].subMenu){
                if(this.selectNaviOne[0].subMenu.length != 0){
                    haveMenuOne = true;//一级菜单有二级菜单
                    if(this.selectNaviOne[0].subMenu[0].subMenu){
                        if(this.selectNaviOne[0].subMenu[0].subMenu.length != 0){
                            haveMenuTwo = true;//二级菜单有三级菜单
                        }
                    }
                }
            }
        }
        let topMenuTwo_1=[], topMenuTwo_tmp;
        let selectMenuOne = this.state.currentMenuOne.replace("menu","");
        if(topMenuTwo.length > 0){//顶部二级菜单，结构[[{},{},{]]]
            if(topMenuTwo[0].length > 0){
                topMenuTwo_tmp = topMenuTwo[0];
                let menuOneIndex = this.findMenuOneIndex(selectMenuOne, topMenuOne_temp[0]);
                if(topMenuTwo_tmp[menuOneIndex]){
                    if(topMenuTwo_tmp[menuOneIndex].length > 0){
                        topMenuTwo_1[0] = topMenuTwo_tmp[menuOneIndex];
                    }
                }
            }
        }
        currentOne = haveMenuOne ? [this.state.currentMenuOne] : [];
        currentTwo = haveMenuTwo ? [this.state.currentMenuTwo] : [];

        return (
            <div className="menu-area">
                {topMenu_1.length>0?(
                    <div className="menu-bar-2nd-bg">
                        <div className="menu-bar-wrapper">
                            <Menu mode="horizontal" className="menu-bar"
                                  selectedKeys={currentOne}
                                  onClick={this.clickMenuOne.bind(this)}>
                                {topMenu_1}
                            </Menu>
                        </div>
                    </div>
                ):(<div></div>)}
                {topMenuTwo_1.length>0?(
                    <div className="menu-bar-3rd-bg">
                        <div style={{clear:'both'}}/>
                        <div className="menu-bar-wrapper">
                            <Menu mode="horizontal" className="menu-bar-3rd"
                                  selectedKeys={currentTwo}
                                  onClick={this.clickMenuTwo.bind(this)}>
                                {topMenuTwo_1}
                            </Menu>
                        </div>
                    </div>
                ):(<div className="menu-bar-bg"></div>)
                }
            </div>
        );
    }
}
MenuBar.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        //getMenuBarInfo:state.getMenuBarInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        menuBarInfo: bindActionCreators(getMenuBarInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);