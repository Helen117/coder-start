import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../middlewares/promise-middleware';
import DevTools from '../tools/ReduxDevTools';

import login from '../containers/login/reducers/login-reducer';
import menu from '../containers/sidebar/reducers/menu-reducer';

import {milestones,putMilestonesProId} from '../containers/milestones/reducers/milestones-reducer';
import getMilestonesIssues from '../containers/milestones/reducers/milestones-table-reducer';
import {register,getLeaderInfo,getRoleInfo,getOrganizationInfo} from '../containers/register/reducers/register-reducer';
import {issue,GetIssueDependent,GetIssueDemand} from '../containers/issues/reducers/issue-reducer';
import forkProject from '../containers/project-list/reducers/fork-project-reducer';
import {approve,approveDetail} from '../containers/approve/reducers/approve-reducer';
import {stageView,stageDetail,codeChange} from '../containers/compile-stage/reducers/jenkins-build-reducer';
import {request,getBusinessInfo,getDeveloperInfo,getTesterInfo} from '../containers/request/reducers/request-reducer';
import getGroupTree from '../containers/project-mgr/reducers/group-tree-reducer';
import createGroup from '../containers/project-mgr/reducers/create-group-reducer';
import createProject from '../containers/project-mgr/reducers/create-project-reducer';
import getGroupMembers from '../containers/project-mgr/reducers/group_members_reducer';
import {consernProject, unconsernProject} from '../containers/project-list/reducers/consern-project-reducer';
import getProjectStar from '../containers/project-mgr/reducers/project-star-reducer';
import {getGroupInfo, getProjectInfo} from '../containers/project-mgr/reducers/select-treenode-reducer';
import {fetchMergeData,fetchMergeBranchData,fetchIssuesData} from '../containers/mergeRequest/reducers/fetch-datasource-reducer';
import fetchMrList from  '../containers/mergeRequest/reducers/mergeRequest-list-reducer'
import {createMr,revertMr} from '../containers/mergeRequest/reducers/mergeRequest-create-reducer';
import fetchBranches from '../containers/branches/reducers/fetch-branches-reducer';
import createBranch from '../containers/branches/reducers/branches-create-reducer';
import deleteBranch from '../containers/branches/reducers/branches-delete-reducer';
import getMenuBarInfo from '../containers/menubar/reducers/menubar-reducer';
import fetchProMsg from '../containers/project-set/reducers/fetch-project-msg-reducer';
import {createProjectSet,updateProjectSet,deleteProjectSet} from '../containers/project-set/reducers/project-set-create-reducers'
import projectSetToState from '../containers/project-set/reducers/put-project-set-to-state-reducer';
import fetchProjectSetTree from '../containers/project-set/reducers/fetch-project-set-tree-reducer';
import getProjectMembers from '../containers/project-mgr/reducers/project-members-reducer';
import {createMilestones,updateMilestones,checkDueDate,closeSetMilestone} from '../containers/milestones/reducers/edit-milestones-reducer'
import getCodeFile from '../containers/code-files/reducers/code-files-reducer';
import getUserRelationTree from '../containers/user-relation/reducers/user-relation-tree-reducer';
import {getUserInfo,getAllUserInfo} from '../containers/user-relation/reducers/user-info-reducer';
import getSelectNode from '../containers/user-relation/reducers/select-node-reducer';
import createUserGroup from '../containers/user-relation/reducers/user-group-detail-reducer';
import createUser from '../containers/user-relation/reducers/user-detail-reducer';
import {AddSshKey,GetSshKeys} from '../containers/user-relation/reducers/ssh-key-reducer';
import {addProjectMember} from '../containers/project-list/reducers/project-member-reducer';
import {getConfirmList} from '../containers/to-be-confirmed/reducers/confirm-list-reducer'
import {getMyProjectInfo,developConfirm} from '../containers/to-be-confirmed/reducers/develop-confirm-reducer'
import {acqPerformanceMsg,acqMyIssueList,getNotifyItems} from '../containers/home/reducers/home-reducer';

const reducer = combineReducers({
    login,
    menu,
    milestones,
    putMilestonesProId,
    getGroupTree,
    createGroup,
    createProject,
    getGroupMembers,
    register,
    issue,
    GetIssueDependent,
    GetIssueDemand,
    forkProject,
    consernProject,
    unconsernProject,
    getProjectStar,
    getGroupInfo,
    getProjectInfo,
    getMilestonesIssues,
    fetchMergeData,
    fetchMergeBranchData,
    fetchIssuesData,
    fetchMrList,
    createMr,
    revertMr,
    fetchBranches,
    createBranch,
    deleteBranch,
    getMenuBarInfo,
    getCodeFile,
    fetchProMsg,
    createProjectSet,
    updateProjectSet,
    deleteProjectSet,
    projectSetToState,
    fetchProjectSetTree,
    getProjectMembers,
    createMilestones,
    getLeaderInfo,
    updateMilestones,
    checkDueDate,
    approve,
    approveDetail,
    closeSetMilestone,
    getUserRelationTree,
    getUserInfo,
    getSelectNode,
    createUserGroup,
    createUser,
    getAllUserInfo,
    codeChange,
    stageView,
    stageDetail,
    AddSshKey,
    addProjectMember,
    GetSshKeys,
    request,
    acqPerformanceMsg,
    acqMyIssueList,
    getConfirmList,
    getMyProjectInfo,
    developConfirm,
    getNotifyItems,
    getOrganizationInfo,
    getRoleInfo,
    getBusinessInfo,
    getDeveloperInfo,
    getTesterInfo,
})


// const createStoreWithMiddleware = applyMiddleware(
//   thunkMiddleware,
//   promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})
// )(createStore);

const enhancer = compose(
    //你要使用的中间件，放在前面
    applyMiddleware(thunkMiddleware, promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})),
    //必须的！启用带有monitors（监视显示）的DevTools
    //生产代码中此部分需屏蔽
    DevTools.instrument()
);

export default function configureStore(initialState) {
    // return createStoreWithMiddleware(reducers, initialState, window.devToolsExtension ? window.devToolsExtension() :f => f);
    return createStore(
        reducer,
        initialState,
        enhancer
        //applyMiddleware(sagaMiddleware(...sagas),router)
    );
}
