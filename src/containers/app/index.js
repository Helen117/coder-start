/**
 * Created by william.xu on 2016/9/4
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Icon,Button,Row,Col, Affix} from 'antd';

import NavPath from '../../containers/nav-path';
import Sidebar from '../../containers/sidebar';
import Header from '../../components/header';
import Footer from '../../components/footer';
import {logout, fetchProfile, cookiesToReduxLoginState} from '../login/actions/login-action';
import { updateNavPath} from '../sidebar/actions/menu-action';
import MenuBar from '../../containers/menubar';
import * as Cookies from "js-cookie";

//import authUtils from '../../utils/auth'

//import 'antd/dist/antd.less';//已包含在index.less中

import './index.less';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isOpened:false,
            isRefresh:false
        }
    }

    componentWillMount() {
        const {actions, uid} = this.props;
        //let realUid = uid?uid:authUtils.getUid();
        //actions.fetchProfile(realUid);
        //actions.fetchProfile(uid);
        if (uid == null){
            actions.cookiesToReduxLoginState();
        }
    }

    findMenuByLocation(data,pathName){//根据url找到对应的一级菜单，作为面包屑
        var navi_keypath_return = [], navi_key_return, find_path = 0;
        for(var i=0; i<data.length;i++){
            if(find_path == 0){
                if(pathName == data[i].link){//url对应一级菜单
                    navi_key_return = "menu"+data[i].id;
                    navi_keypath_return[0] = navi_key_return;
                    find_path++;
                    break;
                }else if(pathName != data[i].link && data[i].subMenu.length > 0){
                    var menuTwo = data[i].subMenu;
                    for(var j=0; j<menuTwo.length; j++){
                        if(pathName == menuTwo[j].link){//url对应二级菜单
                            navi_key_return = "menu"+data[i].id;
                            navi_keypath_return[0] = navi_key_return;
                            find_path++;
                            break;
                        }else if(pathName != menuTwo[j].link && menuTwo[j].subMenu.length > 0){
                            var menuTree = menuTwo[j].subMenu;
                            for(var k=0; k< menuTree.length; k++){
                                if(pathName == menuTree[k].link){//url对应三级菜单
                                    navi_key_return = "menu"+data[i].id;
                                    navi_keypath_return[0] = navi_key_return;
                                    find_path++;
                                    break;
                                }
                            }
                        }
                    }
                }
            }else{break;}
        }
        return {navi_keypath_return, navi_key_return}
    }

    componentWillReceiveProps(nextProps){
        const {menuData, navpath} = nextProps;
        //根据url找到面包屑的key
        var {navi_keypath_return, navi_key_return} = this.findMenuByLocation(menuData, window.location.pathname);
        //如果没有找到key,去掉最后一个“/”，继续找
        let path_return = navi_keypath_return,key_return = navi_key_return;
        let truePath = window.location.pathname;
        while(!key_return && menuData.length>0){//如果没有找到key,去掉最后一个“/”，继续找
            let trueIndex = truePath.lastIndexOf("/");
            truePath = truePath.substr(0,trueIndex);
            let {navi_keypath_return, navi_key_return} = this.findMenuByLocation(menuData,truePath);
            path_return = navi_keypath_return;
            key_return = navi_key_return;
        }

        if(nextProps.navpath.length == 0 && key_return){//登录，刷新时更新面包屑
            var is_menuclick = false;
            this.props.updateNavPath(path_return, key_return, is_menuclick);
        }else if(nextProps.navpath.length != 0 && this.props.navpath == nextProps.navpath){
            //返回时更新面包屑，除去点击项目树和顶部导航的情况
            if(this.props.selectedNode == nextProps.selectedNode && this.props.getMenuBarInfo == nextProps.getMenuBarInfo){
                var is_menuclick = false;
                this.props.updateNavPath(path_return, key_return, is_menuclick);
            }
        }
    }

    logout() {
        this.props.actions.logout();
        this.context.router.replace('/login');
    }

    clickSideBar(isOpened){
        this.setState({
            isOpened:isOpened
        });
    }

    clickBreadSideBar(){
        this.setState({
            isOpened: this.state.isOpened ? false : true
        });
    }

    sideMenuClick(isRefresh){
        this.setState = ({
            isRefresh:isRefresh
        })
    }

    render() {
        const {uid, profile} = this.props;
        //let realUid = uid?uid:authUtils.getUid();
        if (uid == null){
            return <div className="ant-layout-aside"></div>;
        }
        return (
            <div className="ant-layout-aside">
                <Sidebar uid={uid} clickSideBar={this.clickSideBar.bind(this)}
                         isOpened={this.state.isOpened}
                         sideMenuClick={this.sideMenuClick.bind(this)}
                />
                <Affix>
                    <Header profile={profile} logout={this.logout.bind(this)} showSideBar={this.clickBreadSideBar.bind(this)}/>
                </Affix>
                <div className="ant-layout-main" >
                    <Affix offsetTop={66}>
                        <NavPath />
                        <MenuBar menuData={this.props.menuData}
                                 navpath={this.props.navpath}
                                 is_menuclick={this.props.is_menuclick}
                        />
                    </Affix>
                    <div className="ant-layout-container">
                        {/*<div className="ant-layout-content">*/}
                        {this.props.children}
                        {/*</div>*/}
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

App.propTypes = {
    uid: PropTypes.number,
    profile: PropTypes.object,
    children: PropTypes.node.isRequired
};

App.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const {login} = state;
    return {
        uid: login.uid ? login.uid : null,
        profile: login.profile ? login.profile : null,
        menuData:state.menu.items,
        navpath: state.menu.navpath,
        is_menuclick:state.menu.is_menuclick,
        selectedNode:state.getGroupInfo.selectedNode,
        getMenuBarInfo:state.getMenuBarInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({logout, fetchProfile, cookiesToReduxLoginState}, dispatch),
        updateNavPath: bindActionCreators(updateNavPath, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);