import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../middlewares/promise-middleware';
import DevTools from '../tools/ReduxDevTools';

import login from '../containers/login/reducers/login-reducer';
import menu from '../containers/sidebar/reducers/menu-reducer';

import {milestones,putMilestonesProId} from '../containers/milestones/reducers/milestones-reducer';
import getMilestonesIssues from '../containers/milestones/reducers/milestones-table-reducer';
import register from '../containers/register/reducers/register-reducer';
import {issue,GetIssueDependent} from '../containers/issues/reducers/issue-reducer';
import forkProject from '../containers/project-list/reducers/fork-project-reducer';

import getGroupTree from '../containers/project-mgr/reducers/group-tree-reducer';
import createGroup from '../containers/project-mgr/reducers/create-group-reducer';
import createProject from '../containers/project-mgr/reducers/create-project-reducer';
import getGroupMembers from '../containers/project-mgr/reducers/group_members_reducer';
import {consernProject, unconsernProject} from '../containers/project-list/reducers/consern-project-reducer';
import getProjectStar from '../containers/project-mgr/reducers/project-star-reducer';
import {getGroupInfo, getProjectInfo} from '../containers/project-mgr/reducers/select-treenode-reducer';
import {fetchMergeData,fetchMergeBranchData,fetchIssuesData} from '../containers/mergeRequest/reducers/fetch-datasource-reducer';
import fetchMrList from  '../containers/mergeRequest/reducers/mergeRequest-list-reducer'
import createMr from '../containers/mergeRequest/reducers/mergeRequest-create-reducer';
import fetchBranches from '../containers/branches/reducers/fetch-branches-reducer';
import createBranch from '../containers/branches/reducers/branches-create-reducer';
import getMenuBarInfo from '../containers/menubar/reducers/menubar-reducer';
import fetchProMsg from '../containers/virtual-group/reducers/fetch-project-msg-reducer';
import createVirtualGroup from '../containers/virtual-group/reducers/virtual-group-create-reducers'
import virtualGroupToState from '../containers/virtual-group/reducers/put_virtual_group_to_state_reducer';
import fetchVirtualGroupTree from '../containers/virtual-group/reducers/fetch_virtual_group_tree_reducer';
import getProjectMembers from '../containers/project-mgr/reducers/project-members-reducer';
import createMilestones from '../containers/virtual-group-milestones/reducers/create-milestones-reducer'

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
    fetchBranches,
    createBranch,
    getMenuBarInfo,
    fetchProMsg,
    createVirtualGroup,
    virtualGroupToState,
    fetchVirtualGroupTree,
    getProjectMembers,
    createMilestones
});

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
