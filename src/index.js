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
import {MergeRequestList,CreateMergeRequest,CodeChanges} from './containers/mergeRequest';
import {BranchesList,CreateBranches} from './containers/branches';
import Register from './containers/register'
import {UserList, UserDetail} from './containers/user';

import NotFound from './components/page/not-found';

import ForkList from './containers/fork';
import {ProjectSetCreate,ProjectSetTree,ShowInfo} from './containers/project-set';
import ProjectSetMilestones from './containers/project-set-milestone';

import {RequirementConditionList,EditRequest} from './containers/request';

import {ProjectSetMilestonesEdit,ProjectSetMilestonesDetail} from './containers/milestones'
import  {AddIssue,IssueNotes,ProjectIssueList,MyIssueList,EditBug,AddRequest} from './containers/issues';
import {ApproveList,RegistrationApproval,MrApproval} from './containers/approve';
import {ConfirmList,DevelopConfirm,DevelopTransPond} from './containers/to-be-confirmed';
import {TestCase,EditTestCase} from './containers/test-case'
import {LabelEdit,Labels} from './containers/label';
import ProjectMilestones from './containers/project-milestone';
import ProjectMgr, {GroupDetail, ProjectDetail} from './containers/project-mgr';
import CodeFiles from './containers/code-files/index';
import FileTree from './containers/code-files/file-tree';
import CodeView from './containers/code-files/code-view';
import UserRelation from './containers/user-relation';
import userInfo from './containers/user-relation/user-info';
import UserGroupDetail from './containers/user-relation/user-group-detail';
import UpdateUserInfo from './containers/update-user-info';
import ProjectMgrSub from './containers/project-list/index';
import ProjectCompile from './containers/project-compile';
import ProjectBuildHistory from './containers/project-compile/build-history';
//import authUtils from './utils/auth';
//import {getCookie} from './utils';
import * as Cookies from "js-cookie";
import DevTools from "./tools/ReduxDevTools";

import MainPageComponent from './components/echarts-demo/MainPageComponent.jsx';
import EchartsComponent from './components/echarts-demo/EchartsComponent.jsx';

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
root.style = "min-height:100%";
document.body.appendChild(root);

// console.log = (function(oriLogFunc){
//     return function(str) {
//         if (process.env.NODE_ENV == 'development'){
//             //oriLogFunc.call(console, str);
//             oriLogFunc.apply(console, arguments);
//         }
//     }
// })(console.log);

const consoleFun = (oriConsoleFunc)=>function(str){
    if (process.env.NODE_ENV == 'development'){
        // for (let i in arguments){
        //     arguments[i] = '[devops] ' + arguments[i];
        // }
        oriConsoleFunc.apply(console, arguments);
    }
}
console.log = consoleFun(console.log);
console.debug = consoleFun(console.debug);
console.info = consoleFun(console.info);
//console.warn = consoleFun(console.warn);
//console.error = consoleFun(console.error);

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
                            <Route name="projectMgrSub" breadcrumbName="项目列表" path="project-mgr-sub" component={ProjectMgrSub}/>
                            <Route name="milestones" breadcrumbName="里程碑" path="milestones" component={ProjectMilestones}/>
                            <Route name="issueList" breadcrumbName="项目问题管理" path="issue" component={ProjectIssueList}/>
                            <Route name="addRequest" breadcrumbName="项目需求管理" path="add-request" component={AddRequest}/>
                            <Route name="branches" breadcrumbName="分支管理" path="branches" component={BranchesList}/>
                            <Route name="mergeRequestList" breadcrumbName="MR管理" path="mergeRequest" component={MergeRequestList}/>
                            <Route name="codeFile" breadcrumbName="项目代码" path="code-file" component={CodeFiles}>
                                <Route name="fileTree" breadcrumbName="代码树" path="file-tree" component={FileTree}/>
                                <Route name="codeView" breadcrumbName="代码查看" path="code-view" component={CodeView}/>
                            </Route>
                            <Route name="projectCompile" path="project-compile" component={ProjectCompile}/>
                            <Route name="projectBuildHistory" path="project-build-history" component={ProjectBuildHistory}/>

                        </Route>
                        <Route name="userRelation" breadcrumbName="人员组织树" path="userRelation" component={UserRelation}>
                            <Route name="userInfo" breadcrumbName="人员信息" path="userInfo" component={userInfo}/>
                        </Route>
                        <Route name="userGroupDetail" breadcrumbName="新修组织" path="userGroupDetail" component={UserGroupDetail}/>
                        <Route name="myIssueList" breadcrumbName="我的问题" path="myIssue" component={MyIssueList}/>

                        <Route name="groupDetail" breadcrumbName="项目组明细" path="group-detail" component={GroupDetail}/>
                        <Route name="projectDetail" breadcrumbName="项目明细" path="project-detail" component={ProjectDetail}/>
                        <Route name="forkList" breadcrumbName="ForkList信息" path="forkList" component={ForkList}/>
                        <Route name="ProjectSetTree" breadcrumbName="项目集合管理" path="projectSetTree" component={ProjectSetTree}>
                            <Route name="request" breadcrumbName="需求管理" path="request" component={RequirementConditionList}/>
                            <Route name="projectSetInfo" breadcrumbName="项目集合信息" path="projectSetInfo" component={ShowInfo}/>
                            <Route name="ProjectSetMilestones" breadcrumbName="项目集合里程碑" path="projectSetMilestones" component={ProjectSetMilestones}/>
                        </Route>
                        <Route name="label" breadcrumbName="Label列表" path="label" component={Labels}/>
                        <Route name="labelEdit" breadcrumbName="Label编辑" path="labelEdit" component={LabelEdit}/>
                        <Route name="requestEdit" breadcrumbName="需求编辑" path="requestEdit" component={EditRequest}/>

                        <Route name="ProjectSetCreate" breadcrumbName="创建修改项目集合" path="editProjectSet" component={ProjectSetCreate}/>
                        <Route name="addIssue" breadcrumbName="问题编辑" path="issueEdit" component={AddIssue}/>
                        <Route name="bugEdit" breadcrumbName="Bug管理" path="bug-edit" component={EditBug}/>
                        <Route name="issueNotes" breadcrumbName="问题历史讨论" path="issueNotes" component={IssueNotes}/>
                        <Route name="ProjectSetMilestonesEdit" breadcrumbName="创建里程碑" path="projectSetMilestonesEdit" component={ProjectSetMilestonesEdit}/>
                        <Route name="ProjectMilestonesDetail" breadcrumbName="里程碑详细内容" path="projectSetMilestonesDetail" component={ProjectSetMilestonesDetail}/>
                        <Route name="createMergeRequest" breadcrumbName="创建MR" path="createMergeRequest" component={CreateMergeRequest}/>
                        <Route name="CreateBranches" breadcrumbName="创建分支" path="createBranches" component={CreateBranches}/>
                        <Route name="approveList" breadcrumbName="待审批" path="approveList" component={ApproveList}/>
                        <Route name="approveRegister" breadcrumbName="注册审批" path="approveRegister" component={RegistrationApproval}/>
                        <Route name="confirmList" breadcrumbName="待确认事项" path="confirmList" component={ConfirmList}/>
                        <Route name="confirmOperate" breadcrumbName="待确认操作" path="confirmOperate" component={DevelopConfirm}/>
                        <Route name="transpondOperate" breadcrumbName="转派操作" path="transpondOperate" component={DevelopTransPond}/>
                        <Route name="approveMr" breadcrumbName="代码合并审批" path="approveMr" component={MrApproval}/>
                        <Route name="updateUserInfo" breadcrumbName="修改人员" path="updateUserInfo" component={UpdateUserInfo}></Route>
                        <Route name="testCase" breadcrumbName="测试案例" path="testCase" component={TestCase}/>
                        <Route name="testCaseEdit" breadcrumbName="测试案例编辑" path="testCaseEdit" component={EditTestCase}/>
                        <Route name="codeChanges" breadcrumbName="代码变更详情" path="CodeChanges" component={CodeChanges}/>

                    </Route>
                    <Route path="register" component={Register}/>
                    <Route path="login" component={Login}/>

                    <Route path="/echarts" component={MainPageComponent}>
                        <Route path="/echarts/:type" component={EchartsComponent}/>
                    </Route>

                    <Route path="*" component={NotFound}/>
                </Route>
            </Router>
        </Provider>
        {process.env.NODE_ENV=='development'?(<DevTools store={store}/>):(<div/>)}
    </div>,
    root
);