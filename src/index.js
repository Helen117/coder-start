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
import {ProjectSetCreate,ProjectSetTree,ShowInfo,EmergencyProjectSetEdit} from './containers/project-set';
import ProjectSetMilestones from './containers/project-set-milestone';

import {RequirementConditionList,EditRequest} from './containers/request';

import {ProjectSetMilestonesEdit,ProjectSetMilestonesDetail,MilestoneRequest} from './containers/milestones'
import  {AddIssue,IssueNotes,ProjectIssueList,MyIssueList,EditBug,AddRequest} from './containers/issues';
import {ApproveList,RegistrationApproval,MrApproval} from './containers/approve';
import {ConfirmList,DevelopConfirm,DevelopTransPond} from './containers/to-be-confirmed';
import {TestCase,EditTestCase} from './containers/test-case'
import {LabelEdit,Labels} from './containers/label';
import ToDoListStatistics from './containers/report';
import BusinessDemandStatistics from './containers/report/scope-of-business';
import TeamMemberDemandProportion from './containers/report/team-defect-analysis';
import manageViewDemandRank from './containers/report/demand-ranking';
import PersonalCodeManageReport from './containers/report/personal-code-manage'
import memberDailyDemandComplete from './containers/report/member-daily-demand-complete'
import TeamDailyDemandStatistics from './containers/report/team-daily-demand-complete'
import TeamStatistics from './containers/report/team-statistics'
import developerTesterReport from './containers/report/developer-tester-report'
import MemberCurrentWork from './containers/report/member-current-work'
import TeamCurrentWork from './containers/report/team-current-work'

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
import ProjectCompile2 from './containers/project-compile/index2';
import DeployHostConfig from './containers/project-compile/deploy-host-config';
import {BranchMerge} from './containers/branchMerge';
import ProjectScanner from './containers/project-scanner/index';
import Leangoo from './containers/leangoo/index';
//import authUtils from './utils/auth';
//import {getCookie} from './utils';
import * as Cookies from "js-cookie";
import DevTools from "./tools/ReduxDevTools";

import MainPageComponent from './components/echarts-demo/MainPageComponent.jsx';
import EchartsComponent from './components/echarts-demo/EchartsComponent.jsx';
import  {Story,EditStory} from './containers/story';
import TaskCard from './containers/task-card/index';
import EditTask from './containers/task-card/edit-task';

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
callback();
};
const root = document.createElement('div');
//root.style = "min-height:100%";
const loading = document.getElementById('loading');
if (loading){
    document.body.removeChild(loading);
}
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
                            <Route name="projectCompile2" path="project-compile2" component={ProjectCompile2}/>

                            <Route name="ProjectScanner" breadcrumbName="质量扫描" path="projectScanner" component={ProjectScanner}/>
                        </Route>
                        <Route name="deployHostConfig" path="config-sshserver" component={DeployHostConfig}/>

                        <Route name="userRelation" breadcrumbName="人员组织树" path="userRelation" component={UserRelation}>
                            <Route name="userInfo" breadcrumbName="人员信息" path="userInfo" component={userInfo}/>
                        </Route>
                        <Route name="userGroupDetail" breadcrumbName="新修组织" path="userGroupDetail" component={UserGroupDetail}/>
                        <Route name="myIssueList" breadcrumbName="我的问题" path="myIssue" component={MyIssueList}/>
                        <Route name="report" breadcrumbName="报表" path="report" component={ToDoListStatistics}/>
                        <Route name="groupDetail" breadcrumbName="项目组明细" path="group-detail" component={GroupDetail}/>
                        <Route name="projectDetail" breadcrumbName="项目明细" path="project-detail" component={ProjectDetail}/>
                        <Route name="forkList" breadcrumbName="ForkList信息" path="forkList" component={ForkList}/>
                        <Route name="ProjectSetTree" breadcrumbName="项目集合管理" path="projectSetTree" component={ProjectSetTree}>
                            <Route name="request" breadcrumbName="需求管理" path="request" component={RequirementConditionList}/>
                            <Route name="projectSetInfo" breadcrumbName="项目集合信息" path="projectSetInfo" component={ShowInfo}/>
                            <Route name="ProjectSetMilestones" breadcrumbName="项目集合里程碑" path="projectSetMilestones" component={ProjectSetMilestones}/>
                            <Route name="report" breadcrumbName="业务范畴需求报表" path="businessDemandReport" component={BusinessDemandStatistics}/>
                            <Route name="report" breadcrumbName="团队成员需求占比报表" path="teamMemberDemandProportion" component={TeamMemberDemandProportion}/>
                            <Route name="report" breadcrumbName="管理统计角度工单缺陷排名报表" path="manageViewDemandRank" component={manageViewDemandRank}/>
                            <Route name="report" breadcrumbName="个人某里程碑中的代码提交整体情况" path="personal" component={PersonalCodeManageReport}/>
                            <Route name="report" breadcrumbName="团队中成员每日的需求完成情况" path="memberDailyDemand" component={memberDailyDemandComplete}/>
                            <Route name="report" breadcrumbName="多个团队横向比较每日需求完成情况分布" path="teamDailyDemand" component={TeamDailyDemandStatistics}/>
                            <Route name="report" breadcrumbName="横向对多个团队的情况进行对比分析" path="teamStatistics" component={TeamStatistics}/>
                            <Route name="report" breadcrumbName="从团队leader视角展示当前团队中开发及测试人员整体情况" path="developerTesterReport" component={developerTesterReport}/>
                            <Route name="BranchMerge" breadcrumbName="分支代码合并" path="pushBranchCode" component={BranchMerge}/>

                        </Route>
                        <Route name="label" breadcrumbName="Label列表" path="label" component={Labels}/>
                        <Route name="labelEdit" breadcrumbName="Label编辑" path="labelEdit" component={LabelEdit}/>
                        <Route name="requestEdit" breadcrumbName="需求编辑" path="requestEdit" component={EditRequest}/>
                        <Route name="editEmergencyProjectSet" breadcrumbName="创建修改紧急上线项目集合" path="editEmergencyProjectSet" component={EmergencyProjectSetEdit}/>

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
                        <Route name="projectSetMilestonesRequest" breadcrumbName="需求列表" path="projectSetMilestonesRequest" component={MilestoneRequest}/>

                        <Route name="report" breadcrumbName="团队成员当前工作情况" path="memberCurrentWork" component={MemberCurrentWork}/>
                        <Route name="report" breadcrumbName="多个团队当前工作情况比较" path="teamCurrentWork" component={TeamCurrentWork}/>
                        <Route name="Leangoo" breadcrumbName="看板" path="leangoo" component={Leangoo}>
                            <Route name="story" breadcrumbName="story" path="story" component={Story}/>
                        </Route>
                        </Route>

                    <Route name="editStory" breadcrumbName="editStory" path="editStory" component={EditStory}/>

                    <Route path="register" component={Register}/>
                    <Route path="login" component={Login}/>

                    <Route path="/echarts" component={MainPageComponent}>
                        <Route path="/echarts/:type" component={EchartsComponent}/>
                    </Route>

                    <Route path="/task" component={TaskCard}/>
                    <Route path="/editTask" component={EditTask}/>

                    <Route path="*" component={NotFound}/>
                </Route>
            </Router>
        </Provider>
        {process.env.NODE_ENV=='development'?(<DevTools store={store}/>):(<div/>)}
    </div>,
    root
);