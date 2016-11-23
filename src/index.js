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
import {mergeRequestList,createMergeRequest} from './containers/mergeRequest';
import {branchesList,createBranches} from './containers/branches';
import Register from './containers/register'
import {UserList, UserDetail} from './containers/user';

import NotFound from './components/page/not-found';

import ForkList from './containers/fork';
import {projectSetCreate,projectSetTree,showInfo} from './containers/project-set';
import projectSetMilestones from './containers/project-set-milestone';

import {StageView,CodeChangesList} from './containers/compile-stage';
import {projectSetMilestonesEdit,projectSetMilestonesDetail} from './containers/milestones'
import  {AddIssue,IssueNotes,ProjectIssueList,MyIssueList} from './containers/issues';
import {ApproveList,RegistrationApproval} from './containers/approve';
import {ProjectList, ProjectItem, ProjectMember} from './containers/project-list';
//import ProjectItem from './containers/project-list';
import projectMilestones from './containers/project-milestone';
import ProjectMgr, {GroupDetail, ProjectDetail} from './containers/project-mgr';
import CodeFiles from './containers/code-files/index';
import FileTree from './containers/code-files/file-tree';
import CodeView from './containers/code-files/code-view';
import UserRelation from './containers/user-relation';
import userInfo from './containers/user-relation/user-info';
import UserGroupDetail from './containers/user-relation/user-group-detail';
import UpdateUserInfo from './containers/user-relation/user-detail';
import UpdatePassword from './containers/user-relation/update-password';



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
    if (!isLoggedIn && next.location.pathname != '/login') {
        replace('/login');
    }
    //const isLoggedIn = getCookie('uid');
    callback();
};
const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
                <Route path="/" onEnter={validate}>
                    <IndexRedirect to="home"/>
                    <Route component={App}>

                        <Route name="home" breadcrumbName="首页" path="home" component={Home}/>
                        <Route name="userMgr" breadcrumbName="用户列表" path="user" component={UserList}>
                            <Route name="userDetail" breadcrumbName="用户明细" path="edit" component={UserDetail}/>
                        </Route>

                        <Route name="projectMgr" breadcrumbName="项目管理" path="project-mgr" component={ProjectMgr}>
                            <Route name="projectList" breadcrumbName="项目列表" path="project-list" component={ProjectList}>

                            </Route>
                            <Route name="projectItem" breadcrumbName="项目明细" path="project-item" component={ProjectItem}>
                                <Route name="projectMember" breadcrumbName="项目成员" path="project-member" component={ProjectMember}></Route>
                            </Route>
                            <Route name="milestones" breadcrumbName="里程碑" path="milestones" component={projectMilestones}/>
                            <Route name="issueList" breadcrumbName="项目问题管理" path="issue" component={ProjectIssueList}/>
                            <Route name="myIssueList" breadcrumbName="我的问题" path="myIssue" component={MyIssueList}/>
                            <Route name="branches" breadcrumbName="分支管理" path="branches" component={branchesList}/>
                            <Route name="mergeRequestList" breadcrumbName="MR管理" path="mergeRequest" component={mergeRequestList}/>
                            <Route name="codeFile" breadcrumbName="项目代码" path="code-file" component={CodeFiles}>
                                <Route name="fileTree" breadcrumbName="代码树" path="file-tree" component={FileTree}/>
                                <Route name="codeView" breadcrumbName="代码查看" path="code-view" component={CodeView}/>
                            </Route>
                        </Route>
                        <Route name="groupDetail" breadcrumbName="项目组明细" path="group-detail" component={GroupDetail}/>
                        <Route name="projectDetail" breadcrumbName="项目明细" path="project-detail" component={ProjectDetail}/>
                        <Route name="forkList" breadcrumbName="ForkList信息" path="forkList" component={ForkList}/>
                        <Route name="projectSetTree" breadcrumbName="项目集合管理" path="projectSetTree" component={projectSetTree}>
                            <Route name="projectSetInfo" breadcrumbName="项目集合信息" path="projectSetInfo" component={showInfo}/>
                            <Route name="projectSetMilestones" breadcrumbName="项目集合里程碑" path="projectSetMilestones" component={projectSetMilestones}/>
                        </Route>
                        <Route name="projectSetCreate" breadcrumbName="创建修改项目集合" path="editProjectSet" component={projectSetCreate}/>
                        <Route name="addIssue" breadcrumbName="问题编辑" path="issueEdit" component={AddIssue}/>
                        <Route name="issueNotes" breadcrumbName="问题历史讨论" path="issueNotes" component={IssueNotes}/>
                        <Route name="projectSetMilestonesEdit" breadcrumbName="创建里程碑" path="projectSetMilestonesEdit" component={projectSetMilestonesEdit}/>
                        <Route name="projectMilestonesDetail" breadcrumbName="里程碑详细内容" path="projectSetMilestonesDetail" component={projectSetMilestonesDetail}/>
                        <Route name="createMergeRequest" breadcrumbName="创建MR" path="createMergeRequest" component={createMergeRequest}/>
                        <Route name="createBranches" breadcrumbName="创建分支" path="createBranches" component={createBranches}/>
                        <Route name="approveList" breadcrumbName="待审批" path="approveList" component={ApproveList}/>
                        <Route name="approveRegister" breadcrumbName="注册审批" path="approveRegister" component={RegistrationApproval}/>
                        <Route name="userRelation" breadcrumbName="人员组织树" path="userRelation" component={UserRelation}>
                            <Route name="userInfo" breadcrumbName="人员信息" path="userInfo" component={userInfo}/>
                        </Route>
                        <Route name="userGroupDetail" breadcrumbName="新修组织" path="userGroupDetail" component={UserGroupDetail}/>
                        <Route name="updateUserInfo" breadcrumbName="修改人员" path="updateUserInfo" component={UpdateUserInfo}>
                            <Route name="updatePassword" breadcrumbName="修改密码" path="updatePassword" component={UpdatePassword}/>
                        </Route>
                        <Route name="jenkins" breadcrumbName="Jenkins" path="jenkins">
                            <Route name="stageView" breadcrumbName="编译步骤" path="stageView" component={StageView}/>
                            <Route name="codeChange" breadcrumbName="代码变更" path="codeChange" component={CodeChangesList}/>
                        </Route>
                    </Route>
                    <Route path="register" component={Register}/>
                    <Route path="login" component={Login}/>
                    <Route path="*" component={NotFound}/>
                </Route>
            </Router>
        </Provider>
        {process.env.NODE_ENV=='development'?(<DevTools store={store}/>):(<div/>)}
    </div>,
    root
);