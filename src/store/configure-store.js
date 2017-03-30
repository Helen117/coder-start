import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../middlewares/promise-middleware';
import DevTools from '../tools/ReduxDevTools';

import login from '../containers/login/reducers/login-reducer';
import menu from '../containers/sidebar/reducers/menu-reducer';
import {milestones} from '../containers/milestones/milestones-reducer';
import register from '../containers/register/reducers/register-reducer';
import issue from '../containers/issues/reducers/issue-reducer';
import forkProject from '../containers/project-list/reducers/fork-project-reducer';
import approve from '../containers/approve/reducers/approve-reducer';
import request from '../containers/request/reducers/request-reducer';
import label from '../containers/label/reducers/label-reducer';
import getGroupTree from '../containers/project-mgr/reducers/group-tree-reducer';
import projectGroup from '../containers/project-mgr/reducers/create-group-reducer';
import project from '../containers/project-mgr/reducers/create-project-reducer';
import consernProject from '../containers/project-list/reducers/consern-project-reducer';
import {mergeRequest} from '../containers/mergeRequest/mergeRequest-reducer';
import branch from '../containers/branches/branches-reducer';
import getMenuBarInfo from '../containers/menubar/reducers/menubar-reducer';
import {projectSet} from '../containers/project-set/project-set-reducers';
import getCodeFile from '../containers/code-files/reducers/code-files-reducer';
import UserRelation from '../containers/user-relation/reducers/user-relation-reducer';
import {projectMember} from '../containers/project-list/reducers/project-member-reducer';
import {toBeConfirmedItem} from '../containers/to-be-confirmed/reducer'
import {acqPerformanceMsg} from '../containers/home/reducers/home-reducer';
import projectCompile from '../containers/project-compile/reducer';
import UpdateUserInfo from '../containers/update-user-info/reducer/update-user-info-reducer';
import treeFilter from '../components/tree-filter/reducer';
import report from '../containers/report/report-reducer';
import branchMerge from '../containers/branchMerge/reducers';
import projectScanner from '../containers/project-scanner/reducers/project-scanner-reducer';
import story from '../containers/story/reducer';
const reducer = combineReducers({
    login,
    menu,
    milestones,
    getGroupTree,
    projectGroup,
    project,
    register,
    issue,
    forkProject,
    mergeRequest,
    branch,
    getMenuBarInfo,
    getCodeFile,
    projectSet,
    approve,
    UserRelation,
    projectMember,
    request,
    acqPerformanceMsg,
    toBeConfirmedItem,
    projectCompile,
    label,
    UpdateUserInfo,
    consernProject,
    treeFilter,
    report,
    branchMerge,
    projectScanner,
    story
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