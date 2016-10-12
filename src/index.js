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
import {mergeRequestList,createMergeRequest} from './containers/mergeRequest';
import Register from './containers/register'
import {UserList, UserDetail} from './containers/user';

import NotFound from './components/page/not-found';


import  {AddIssue,IssueNotes,IssueList} from './containers/issues'

import ProjectList from './containers/project-list';

import ProjectMgr, {GroupDetail, ProjectDetail} from './containers/project-mgr';


//import authUtils from './utils/auth';
//import {getCookie} from './utils';
import * as Cookies from "js-cookie";
import DevTools from "./tools/ReduxDevTools";

const history = useRouterHistory(createHistory)({basename: ''});
//const history = syncHistoryWithStore(hashHistory, store);
const store = configureStore();

const validate = function (next, replace, callback) {
    //const isLoggedIn = authUtils.getToken()
    //const isLoggedIn = getCookie('uid');
    const isLoggedIn = Cookies.get('uid');
    if (!isLoggedIn && next.location.pathname != '/login.html') {
        replace('/login.html')
    }
    callback();
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" onEnter={validate}>
                    <IndexRedirect to="home.html"/>
                    <Route component={App}>

                        <Route name="home" breadcrumbName="首页" path="home.html" component={Home}/>
                        <Route name="userMgr" breadcrumbName="用户列表" path="user.html" component={UserList}>
                            <Route name="userDetail" breadcrumbName="用户明细" path="edit.html" component={UserDetail}/>
                        </Route>
                        <Route name="milestones" breadcrumbName="里程碑" path="milestones.html" component={Milestones}/>
                        <Route name="milestonesDetail" breadcrumbName="里程碑详细内容" path="milestonesDetail.html" component={MilestoneDetail}/>
                        <Route name="createMilestones" breadcrumbName="创建里程碑" path="createMilestones.html" component={MilestoneCreate}/>
                        <Route name="projectMgr" breadcrumbName="项目管理" path="project-mgr.html" component={ProjectMgr}>
                        </Route>
                        <Route name="issueList" breadcrumbName="问题管理" path="issue.html" component={IssueList}/>
                        <Route name="addIssue" breadcrumbName="问题编辑" path="issueEdit.html" component={AddIssue}/>
                        <Route name="issueNotes" breadcrumbName="问题历史讨论" path="issueNotes.html" component={IssueNotes}/>
                        <Route name="projectList" breadcrumbName="项目列表" path="project-list.html" component={ProjectList}>
                        </Route>
                        <Route name="groupDetail" breadcrumbName="项目组明细" path="group-detail.html" component={GroupDetail}/>
                        <Route name="projectDetail" breadcrumbName="项目明细" path="project-detail.html" component={ProjectDetail}/>
                        <Route name="mergeRequest" breadcrumbName="代码合并请求(MR)管理" path="mergeRequest.html" component={mergeRequestList}/>
                        <Route name="createMergeRequest" breadcrumbName="创建代码合并请求" path="createMergeRequest.html" component={createMergeRequest}/>

                    </Route>
                    <Route path="register.html" component={Register}/>
                    <Route path="login.html" component={Login}/>
                    <Route path="*" component={NotFound}/>
                    </Route>
            </Router>
        </Provider>
        {process.env.NODE_ENV=='development'?(<DevTools store={store}/>):(<div/>)}
    </div>,
    root
);
