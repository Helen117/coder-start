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
import * as home from '../home/actions/home-action';
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
            is_menuclick:false,
            lightMenuBar:''
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

    componentDidMount() {
       this.intervalId = setInterval(()=>{this.props.home.getNotifyItems(this.props.uid)},5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    findMenuByLocation(data,pathName){//根据url找到对应的一级菜单，作为面包屑
        var navi_keypath_return = [], navi_key_return, find_path = 0, light_menubar='';
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
                            light_menubar = "menu"+menuTwo[j].id;
                            break;
                        }else if(pathName != menuTwo[j].link && menuTwo[j].subMenu.length > 0){
                            var menuTree = menuTwo[j].subMenu;
                            for(var k=0; k< menuTree.length; k++){
                                if(pathName == menuTree[k].link){//url对应三级菜单
                                    navi_key_return = "menu"+data[i].id;
                                    navi_keypath_return[0] = navi_key_return;
                                    find_path++;
                                    light_menubar = "menu"+menuTree[k].id;
                                    break;
                                }
                            }
                        }
                    }
                }
            }else{break;}
        }
        return {navi_keypath_return, navi_key_return,light_menubar}
    }

    componentWillReceiveProps(nextProps){
        const {uid,home} = this.props;
        const {menuData, navpath} = nextProps;
        //根据url找到面包屑的key
        var {navi_keypath_return, navi_key_return,light_menubar} = this.findMenuByLocation(menuData, window.location.pathname);
        //如果没有找到key,去掉最后一个“/”，继续找
        let path_return = navi_keypath_return,key_return = navi_key_return;
        let light = light_menubar;
        let truePath = window.location.pathname;
        while(!key_return && menuData.length>0){//如果没有找到key,去掉最后一个“/”，继续找
            let trueIndex = truePath.lastIndexOf("/");
            if(trueIndex == 0 && navpath.length==0){//刷新回首页
                path_return[0] = "menu1";
                key_return = "menu1";
                this.context.router.push({
                    pathname: '/home',
                });
            }else if(trueIndex == 0 && navpath.length>0){//保持当前面包屑
                key_return = "menu"+navpath[0].key;
                path_return[0] = key_return;
            }else{//找到新面包屑
                truePath = truePath.substr(0,trueIndex);
                let {navi_keypath_return, navi_key_return,light_menubar} = this.findMenuByLocation(menuData,truePath);
                path_return = navi_keypath_return;
                key_return = navi_key_return;
                light = light_menubar;
            }
        }

        let _key;
        if(key_return){
            _key = key_return.replace('menu','');
        }
        if(this.state.lightMenuBar != light){
            this.setState({
                lightMenuBar:light,
                is_menuclick:false
            })
        }
        if(nextProps.navpath.length == 0 && key_return){//登录，刷新时更新面包屑
            home.getNotifyItems(uid);
            this.props.updateNavPath(path_return, key_return);
        }else if(nextProps.navpath[0] && this.props.navpath[0] && key_return
        && nextProps.navpath[0].key != _key){
            //navpath改变时调接口
            this.props.updateNavPath(path_return, key_return);
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

    sideMenuClick(is_menuclick){
        this.setState({
            is_menuclick:is_menuclick
        })
    }

    render() {
        const items = this.props.notifyItems?this.props.notifyItems:{"todo":0,"milestone":0,"total":0,"examination":0};

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
                    <Header profile={profile} logout={this.logout.bind(this)}
                            showSideBar={this.clickBreadSideBar.bind(this)} items={items}/>
                    <NavPath />
                    <MenuBar menuData={this.props.menuData}
                             navpath={this.props.navpath}
                             is_menuclick={this.state.is_menuclick}
                             light_menubar={this.state.lightMenuBar}
                    />
                </Affix>
                <div className="ant-layout-main" >
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
        projectGroup:state.projectGroup,
        getMenuBarInfo:state.getMenuBarInfo,
        notifyItems:state.acqPerformanceMsg.notifyItems,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({logout, fetchProfile, cookiesToReduxLoginState}, dispatch),
        updateNavPath: bindActionCreators(updateNavPath, dispatch),
        home:bindActionCreators(home, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);