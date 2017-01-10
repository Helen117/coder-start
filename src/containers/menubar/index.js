/**
 * Created by Administrator on 2016-10-11.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Menu } from 'antd';
import {getMenuBarInfo} from './actions/menubar-action';
import 'pubsub-js';
import './index.less';
import {findMenuLink, findDefaultMenuBar, findMenuBarInfoByLocation, findDefaultMenuThree,
    findMenuOneIndex, findMenuTwoIndex, findCurrentMenuOne, haveSubMenu} from './utils';

let currentOne,currentTwo;
const topMenuOne_temp=[];

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

    componentWillReceiveProps(nextProps){
        const {navpath, menuData,light_menubar} = nextProps;
        if(navpath && navpath.length != 0 &&
            ((this.props.light_menubar != light_menubar && light_menubar) ||
            (this.props.navpath != navpath ))){
            if(nextProps.is_menuclick){//点击侧边导航，顶部导航恢复默认值
                let {defaultMenuOne_id, defaultMenuTwo_id} = findDefaultMenuBar(menuData, navpath);
                this.setState({
                    refreshMenuOne:true,
                    currentMenuOne:"menu"+defaultMenuOne_id,
                    currentMenuTwo:"menu"+defaultMenuTwo_id,
                })
            }else{//登录、刷新、返回操作更新顶部导航
                //根据url找到当前页面顶部导航的selectKeys
                let {menuOneKey, menuTwoKey} = findMenuBarInfoByLocation(menuData,window.location.pathname);
                let oneKey_return,twoKey_return;
                if(menuOneKey.length>0 && menuTwoKey.length>0){
                    oneKey_return = menuOneKey[0],twoKey_return = menuTwoKey[0];
                }
                let truePath = window.location.pathname;
                while(!oneKey_return && oneKey_return!="" && !twoKey_return
                && menuOneKey.length == 0){//如果没有找到key,去掉最后一个“/”，继续找
                    const trueIndex = truePath.lastIndexOf("/");
                    if(trueIndex == 0 && currentTwo.length>0){//在非主页面点击非菜单路由
                        oneKey_return = currentOne[0];
                        twoKey_return = currentTwo[0];
                    }else if(trueIndex == 0 && currentTwo.length==0){//首页点击
                        oneKey_return = "";
                        twoKey_return = "";
                    }else{//顺路由一级一级往上找到菜单路由
                        truePath = truePath.substr(0,trueIndex);
                        let {menuOneKey, menuTwoKey} = findMenuBarInfoByLocation(menuData,truePath);
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

    componentDidUpdate(){
        //获取顶部导航的一级、二级菜单当前选中项，放到state中，用于点击项目树时，停留在当前页面
        let currentOneInfo = {},currentTwoInfo = {};
        if(currentOne.length > 0){
            const currentOne_temp = currentOne[0].replace("menu","");
            const menuOneIndex = findMenuOneIndex(currentOne_temp,topMenuOne_temp[0]);
            currentOneInfo = this.selectNaviOne[0].subMenu[menuOneIndex];
            if(currentTwo.length > 0){
                const currentTwo_temp = currentTwo[0].replace("menu","");
                const menuTwoIndex = findMenuTwoIndex(currentTwo_temp, currentOneInfo);
                if(currentOneInfo){
                    currentTwoInfo = currentOneInfo.subMenu[menuTwoIndex];
                }
            }
        }
        this.props.menuBarInfo(currentOneInfo,currentTwoInfo);
    }

    clickMenuOne(e){
        //待修改内容，当点击二级菜单时，要默认展示三级菜单的第一个
        const currentMenuTwo = findDefaultMenuThree(e.key,this.selectNaviOne);
        const {menuData} = this.props;
        let menuLink;
        menuLink = findMenuLink(currentMenuTwo,menuData);
        if(!menuLink){
            menuLink = findMenuLink(e.key.replace("menu",""),menuData);
        }
        this.context.router.push({
            pathname: menuLink
        });
        this.setState({
            refreshMenuOne:false,
            currentMenuOne:e.key,
            currentMenuTwo:"menu"+currentMenuTwo
        })
    }
    clickMenuTwo(e){
        const {menuData} = this.props;
        const menuKey = e.key.replace("menu","");
        const menuLink = findMenuLink(menuKey,menuData);
        this.context.router.push({
            pathname: menuLink
        });
        this.setState({
            refreshMenuOne:false,
            currentMenuTwo:e.key,
        })
    }

    render(){
        const {menuData, navpath} = this.props;
        //当前点击的一级菜单
        this.selectNaviOne = findCurrentMenuOne(menuData,navpath);
        const topMenu = this.selectNaviOne.map((item) => {//顶部一级导航，结构[[{},{},{}]]
            const menuone_null = [];
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    const topMenuData = item.subMenu;
                    const menuOneData = topMenuData.map(( itemTop ) => {
                        return (
                            <Menu.Item key={'menu' + itemTop.id}>
                                {itemTop.name}
                            </Menu.Item>
                        )
                    })
                    return menuOneData;
                }else{return menuone_null;}
            }else{return menuone_null;}
        });
        const topMenu_1=[];
        if(topMenu && topMenu.length > 0 && topMenu[0].length > 0){//顶部一级导航，结构[[{},{},{}]]
            topMenu_1[0] = topMenu[0];
            topMenuOne_temp[0] = topMenu_1[0];
        }
        const topMenuTwo = this.selectNaviOne.map((item) => {//顶部二级导航,结构[[[{},{},{}],[{},{}],[{}]]]
            const menutwo_null = [];
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    const topMenuData = item.subMenu;
                    const topTwoMenu = topMenuData.map((itemTopTwo) => {
                        if(itemTopTwo.subMenu){
                            if(itemTopTwo.subMenu.length != 0){
                                const menuTwoData = itemTopTwo.subMenu;
                                const topTwo = menuTwoData.map((itemTwo) => {
                                    const menuTwoKey = 'menu'+itemTwo.id;
                                    return (
                                        <Menu.Item key={menuTwoKey}>
                                            {itemTwo.name}
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
        //是否存在二级菜单和三级菜单
        let haveMenuOne = false,haveMenuTwo = false;
        if(this.selectNaviOne && this.selectNaviOne.length != 0){
            haveMenuOne = haveSubMenu(this.selectNaviOne[0].id,menuData);
        }
        currentOne = haveMenuOne ? [this.state.currentMenuOne] : [];
        const selectMenuOne = this.state.currentMenuOne.replace("menu","");
        if(haveMenuOne){
            haveMenuTwo = haveSubMenu(selectMenuOne,menuData);
        }
        currentTwo = haveMenuTwo ? [this.state.currentMenuTwo] : [];
        const topMenuTwo_1=[];let topMenuTwo_tmp;
        if(topMenuTwo && topMenuTwo.length > 0 && topMenuTwo[0].length > 0){//顶部二级菜单，结构[[{},{},{]]]
            topMenuTwo_tmp = topMenuTwo[0];
            const menuOneIndex = findMenuOneIndex(selectMenuOne, topMenuOne_temp[0]);
            if(topMenuTwo_tmp[menuOneIndex] && topMenuTwo_tmp[menuOneIndex].length > 0){
                topMenuTwo_1[0] = topMenuTwo_tmp[menuOneIndex];
            }
        }

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

function mapStateToProps() {
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