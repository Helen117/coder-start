import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../middlewares/promise-middleware';
import DevTools from '../tools/ReduxDevTools';

import login from '../containers/login/reducers/login-reducer';
import menu from '../containers/sidebar/reducers/menu-reducer';

import {milestones} from '../containers/milestones/milestones-reducer';
import register from '../containers/register/reducers/register-reducer';
import {issue,GetIssueDependent,GetIssueDemand} from '../containers/issues/reducers/issue-reducer';
import forkProject from '../containers/project-list/reducers/fork-project-reducer';
import approve from '../containers/approve/reducers/approve-reducer';
import request from '../containers/request/reducers/request-reducer';
import label from '../containers/label/reducers/label-reducer';
import getGroupTree from '../containers/project-mgr/reducers/group-tree-reducer';
import createGroup from '../containers/project-mgr/reducers/create-group-reducer';
import createProject from '../containers/project-mgr/reducers/create-project-reducer';
import consernProject from '../containers/project-list/reducers/consern-project-reducer';
import {getGroupInfo, getProjectInfo} from '../containers/project-mgr/reducers/select-treenode-reducer';
import {mergeRequest} from '../containers/mergeRequest/mergeRequest-reducer';
import fetchBranches from '../containers/branches/reducers/fetch-branches-reducer';
import createBranch from '../containers/branches/reducers/branches-create-reducer';
import deleteBranch from '../containers/branches/reducers/branches-delete-reducer';
import getMenuBarInfo from '../containers/menubar/reducers/menubar-reducer';
import fetchProMsg from '../containers/project-set/reducers/fetch-project-msg-reducer';
import {createProjectSet,updateProjectSet,deleteProjectSet} from '../containers/project-set/reducers/project-set-create-reducers'
import projectSetToState from '../containers/project-set/reducers/put-project-set-to-state-reducer';
import fetchProjectSetTree from '../containers/project-set/reducers/fetch-project-set-tree-reducer';
import getProjectMembers from '../containers/project-mgr/reducers/project-members-reducer';
import getCodeFile from '../containers/code-files/reducers/code-files-reducer';
import UserRelation from '../containers/user-relation/reducers/user-relation-reducer';
import {addProjectMember} from '../containers/project-list/reducers/project-member-reducer';
import {getConfirmList} from '../containers/to-be-confirmed/reducers/confirm-list-reducer'
import {getMyProjectInfo,developConfirm} from '../containers/to-be-confirmed/reducers/confirm-reducer';
import {developTranspond,getTranspondMember} from '../containers/to-be-confirmed/reducers/transpond-reducer'
import {acqPerformanceMsg,acqMyIssueList,getNotifyItems} from '../containers/home/reducers/home-reducer';
import projectCompile from '../containers/project-compile/reducer';
import UpdateUserInfo from '../containers/update-user-info/reducer/update-user-info-reducer';

const reducer = combineReducers({
    login,
    menu,
    milestones,
    getGroupTree,
    createGroup,
    createProject,
    register,
    issue,
    GetIssueDependent,
    GetIssueDemand,
    forkProject,
    getGroupInfo,
    getProjectInfo,
    mergeRequest,
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
    getLeaderInfo,
    approve,
    approveDetail,
    UserRelation,
    addProjectMember,
    request,
    acqPerformanceMsg,
    acqMyIssueList,
    getConfirmList,
    getMyProjectInfo,
    developConfirm,
    developTranspond,
    getTranspondMember,
    getNotifyItems,
    projectCompile,
    label,
    UpdateUserInfo,
    consernProject
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