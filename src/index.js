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
import {Milestones,MilestoneDetail,MilestoneCreate} from './containers/milestones';
import {UserList, UserDetail} from './containers/user';



import NotFound from './components/page/not-found';

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
                            <Route name="userEdit" breadcrumbName="用户编辑" path="edit" component={UserDetail}/>
                            </Route>
                        <Route name="milestones" breadcrumbName="里程碑" path="milestones" component={Milestones}/>
                            <Route name="moreMilestones" breadcrumbName="查看更多" path="milestones/moreMilestones" component={MilestoneDetail}/>

                    </Route>
                    <Route path="login" component={Login}/>
                    <Route path="*" component={NotFound}/>
                </Route>
            </Router>
        </Provider>
        <DevTools store={store}/>
    </div>,
    document.getElementById('root')
);
