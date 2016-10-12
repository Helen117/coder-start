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
import {logout, fetchProfile} from '../login/actions/login-action';
import MenuBar from '../../components/menubar';
import * as Cookies from "js-cookie";

//import authUtils from '../../utils/auth'

//import 'antd/dist/antd.less';//已包含在index.less中

import './index.less';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isOpened:false
        }
    }

    componentWillMount() {
        const {actions, uid} = this.props;
        //let realUid = uid?uid:authUtils.getUid();
        //actions.fetchProfile(realUid);
        //actions.fetchProfile(uid);
    }

    logout() {
        this.props.actions.logout();
        this.context.router.replace('/login.html');
    }

    clickSideBar(isOpened){
        //console.log("isOpened:",isOpened);
        this.setState({
            isOpened:isOpened
        });
    }

    clickBreadSideBar(){
        this.setState({
            isOpened: this.state.isOpened ? false : true
        });
        //console.log("!this.state.isOpened:",!this.state.isOpened);
    }

    render() {
        const {uid, profile} = this.props;
        let uid_ = uid;
        let profile_ = profile;
        if (uid_ == null){
            uid_ = Cookies.get('uid');
            profile_ = Cookies.getJSON('profile');
        }
        //let realUid = uid?uid:authUtils.getUid();
        //console.log("this.state.isOpened:",this.state.isOpened);
        return (
            <div className="ant-layout-aside">
                <Sidebar uid={uid_} clickSideBar={this.clickSideBar.bind(this)} isOpened={this.state.isOpened}/>
                <Affix>
                    <Header profile={profile_} logout={this.logout.bind(this)} showSideBar={this.clickBreadSideBar.bind(this)}/>
                </Affix>
                <div className="ant-layout-main" >
                    <Affix offsetTop={66}>
                        <NavPath />
                        <MenuBar />
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
        profile: login.profile ? login.profile : null
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({logout, fetchProfile}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
