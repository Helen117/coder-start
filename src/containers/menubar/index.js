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

var currentOne,currentTwo,topMenuOne_temp=[];
//let selectNaviOne = [];

class MenuBar extends React.Component {
    constructor(){
        super();
        this.selectNaviOne=[];
        this.state = {
            currentMenuOne:"",
            currentMenuTwo:"",
            refreshMenuOne:false,
        }
    }

    findDefaultMenuBar(menuData, navpath){
        for(var i=0; i<menuData.length; i++){
            if(menuData[i].id == navpath[0].key){
                var item = menuData[i], defaultMenuOne_id, defaultMenuTwo_id;
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
        var find_path = 0, menuOneKey, menuTwoKey;
        for(var i=0; i<menuData.length;i++){
            if(find_path == 0){
                if(pathName == menuData[i].link){//url是一级菜单，选中项都是空
                    menuOneKey = "";
                    menuTwoKey = "";
                    find_path++;
                    break;
                }else if(pathName != menuData[i].link && menuData[i].subMenu.length > 0){
                    var menuTwo = menuData[i].subMenu;
                    for(var j=0; j<menuTwo.length; j++){
                        if(pathName == menuTwo[j].link){//url是二级菜单，继续在三级菜单中查找对应的url
                            if(menuTwo[j].subMenu.length > 0){
                                var menuTree = menuTwo[j].subMenu;
                                for(var k=0; k< menuTree.length; k++){
                                    if(pathName == menuTree[k].link){//找到对应的选中项
                                        menuOneKey = "menu"+menuTwo[j].id;
                                        menuTwoKey = "menu"+menuTree[k].id;
                                        find_path++;
                                        break;
                                    }
                                }
                            }
                        }else if(pathName != menuTwo[j].link && menuTwo[j].subMenu.length > 0){
                            var menuTree = menuTwo[j].subMenu;
                            for(var k=0; k< menuTree.length; k++){
                                if(pathName == menuTree[k].link){//url是三级菜单
                                    menuOneKey = "menu"+menuTwo[j].id;
                                    menuTwoKey = "menu"+menuTree[k].id;
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
                if(nextProps.is_menuclick == true){
                    var {defaultMenuOne_id, defaultMenuTwo_id} = this.findDefaultMenuBar(menuData, navpath);
                    this.setState({
                        refreshMenuOne:true,
                        currentMenuOne:"menu"+defaultMenuOne_id,
                        currentMenuTwo:"menu"+defaultMenuTwo_id,
                    })
                }else{
                    var {menuOneKey, menuTwoKey} = this.findMenuBarInfoByLocation(menuData,window.location.pathname);
                    var oneKey_return,twoKey_return;
                    oneKey_return = menuOneKey;
                    twoKey_return = menuTwoKey;
                    if(!menuOneKey && !menuTwoKey){
                        var secondIndex = window.location.pathname.indexOf("/",window.location.pathname.indexOf('/')+1);
                        var pathName_temp = window.location.pathname;
                        pathName_temp = pathName_temp.substr(0,secondIndex);
                        var {menuOneKey, menuTwoKey} = this.findMenuBarInfoByLocation(menuData, pathName_temp);
                        oneKey_return = menuOneKey;
                        twoKey_return = menuTwoKey;
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

    componentDidUpdate(){
        var currentOneInfo = {},currentTwoInfo = {};
        if(currentOne.length > 0){
            var currentOne_temp = currentOne[0].replace("menu","");
            var menuOneIndex = this.findMenuOneIndex(currentOne_temp,topMenuOne_temp[0]);
            currentOneInfo = this.selectNaviOne[0].subMenu[menuOneIndex];
            if(currentTwo.length > 0){
                var currentTwo_temp = currentTwo[0].replace("menu","");
                var menuTwoIndex = this.findMenuTwoIndex(currentTwo_temp, currentOneInfo);
                currentTwoInfo = currentOneInfo.subMenu[menuTwoIndex];
            }
        }
        this.props.menuBarInfo(currentOneInfo,currentTwoInfo);
    }

    clickMenuOne(e){
        this.setState({
            refreshMenuOne:false,
            currentMenuOne:e.key,
        })
    }
    clickMenuTwo(e){
        this.setState({
            refreshMenuOne:false,
            currentMenuTwo:e.key,
        })
    }

    findMenuOneIndex(menuOneKey,menuOne){
        for(var i=0; i<menuOne.length; i++){
            if(menuOneKey == menuOne[i].key.replace("menu","")){
                return i;
            }
        }
    }

    findMenuTwoIndex(menuTwoKey,currentOneInfo){
        for(var i=0; i<currentOneInfo.subMenu.length; i++){
            if(menuTwoKey == currentOneInfo.subMenu[i].id){
                return i;
            }
        }
    }

    render(){
        const {menuData, navpath} = this.props;
        for(var i=0;i<menuData.length;i++){
            if(navpath.length != 0){
                if(navpath[0].key == menuData[i].id){
                    this.selectNaviOne[0] = menuData[i];
                }
            }
        }
        const topMenu = this.selectNaviOne.map((item) => {
            var menuone_null = [];
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    let topMenuData = item.subMenu;
                    const menuOneData = topMenuData.map(( itemTop ) => {
                        return (
                            <Menu.Item key={'menu' + itemTop.id}>
                                <Link to={itemTop.link}>{itemTop.name}</Link>
                            </Menu.Item>
                        )
                    })
                    return menuOneData;
                }else{return menuone_null;}
            }else{return menuone_null;}
        });
        var topMenu_1=[];
        if(topMenu.length > 0){
            if(topMenu[0].length > 0){
                topMenu_1[0] = topMenu[0];
                topMenuOne_temp[0] = topMenu_1[0];
            }
        }
        const topMenuTwo = this.selectNaviOne.map((item) => {
            var menutwo_null = [];
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    let topMenuData = item.subMenu;
                    const topTwoMenu = topMenuData.map((itemTopTwo) => {
                        if(itemTopTwo.subMenu){
                            if(itemTopTwo.subMenu.length != 0){
                                let menuTwoData = itemTopTwo.subMenu;
                                const topTwo = menuTwoData.map((itemTwo) => {
                                    var menuTwoKey = 'menu'+itemTwo.id;
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
        var haveMenuOne = false;
        var haveMenuTwo = false;
        if(this.selectNaviOne.length != 0){
            if(this.selectNaviOne[0].subMenu){
                if(this.selectNaviOne[0].subMenu.length != 0){
                    haveMenuOne = true;
                    if(this.selectNaviOne[0].subMenu[0].subMenu){
                        if(this.selectNaviOne[0].subMenu[0].subMenu.length != 0){
                            haveMenuTwo = true;
                        }
                    }
                }
            }
        }
        var topMenuTwo_1=[], topMenuTwo_tmp;
        var selectMenuOne = this.state.currentMenuOne.replace("menu","");
        if(topMenuTwo.length > 0){
            if(topMenuTwo[0].length > 0){
                topMenuTwo_tmp = topMenuTwo[0];
                var menuOneIndex = this.findMenuOneIndex(selectMenuOne, topMenuOne_temp[0]);
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

    }
}

function mapDispatchToProps(dispatch) {
    return {
        menuBarInfo: bindActionCreators(getMenuBarInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);