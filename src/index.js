/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect, useRouterHistory, hashHistory} from 'react-router';
import {createHistory} from 'history';

import configureStore from './store/configure-store';
//import {syncHistoryWithStore} from "react-router-redux";

import App from './containers/app';
import Home from './containers/home';
import Login from './containers/login';
import Register from './containers/register'
import {UserList, UserDetail} from './containers/user';
import NotFound from './components/page/not-found';
import {ProjectMgr, GroupDetail} from './containers/project-mgr';
import  {AddIssue,IssueNotes} from './containers/issues'

//import authUtils from './utils/auth';
import {getCookie} from './utils';
import DevTools from "./tools/ReduxDevTools";

const history = useRouterHistory(createHistory)({basename: ''});
//const history = syncHistoryWithStore(hashHistory, store);
const store = configureStore();

const validate = function (next, replace, callback) {
    //const isLoggedIn = authUtils.getToken()
    const isLoggedIn = getCookie('uid');
    if (!isLoggedIn && next.location.pathname != '/login') {
        replace('/login')
    }
    callback();
};

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" onEnter={validate}>
                    <IndexRedirect to="home"/>
                    <Route component={App}>
                        <Route name="home" breadcrumbName="首页" path="home" component={Home}/>
                        <Route name="userMgr" breadcrumbName="用户列表" path="user" component={UserList}>
                            <Route name="userDetail" breadcrumbName="用户明细" path="edit" component={UserDetail}/>
                        </Route>
                        <Route name="projectMgr" breadcrumbName="项目管理" path="project-mgr" component={ProjectMgr}>
                        </Route>
                        <Route name="addIssue" breadcrumbName="问题管理" path="issue" component={AddIssue}/>
                        <Route name="issueNotes" breadcrumbName="测试" path="test" component={IssueNotes}/>
                        <Route name="groupDetail" breadcrumbName="项目组明细" path="project-group" component={GroupDetail}/>
                    </Route>
                    <Route path="login" component={Login}/>
                    <Route path="register" component={Register}/>
                    <Route path="*" component={NotFound}/>
                </Route>
            </Router>
        </Provider>
        <DevTools store={store}/>
    </div>,
    document.getElementById('root')
);