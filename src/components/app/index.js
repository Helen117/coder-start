/**
 * Created by william.xu on 2016/9/4
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import NavPath from '../../components/nav-path';
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';
import Footer from '../../components/footer';
import {logout, fetchProfile} from '../login/actions/login-action';

//import authUtils from '../../utils/auth'

//import 'antd/dist/antd.less';//已包含在index.less中

import './index.less';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions, uid} = this.props;
        //let realUid = uid?uid:authUtils.getUid();
        //actions.fetchProfile(realUid);
        actions.fetchProfile(uid);
    }

    logout() {
        this.props.actions.logout();
        this.context.router.replace('/login');
    }

    render() {
        const {uid, profile} = this.props;
        //let realUid = uid?uid:authUtils.getUid();

        return (
            <div className="ant-layout-aside">
                <Header profile={profile} logout={this.logout.bind(this)}/>
                <Sidebar uid={uid}/>
                <div className="ant-layout-main">
                    <NavPath />
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
