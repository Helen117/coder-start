import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../middlewares/promise-middleware';
import DevTools from '../tools/ReduxDevTools';

import login from '../containers/login/reducers/login-reducer';
import menu from '../containers/sidebar/reducers/menu-reducer';

import milestones from '../containers/milestones/reducers/milestones-reducer';
import milestonesDetail from '../containers/milestones/reducers/milestones-table-reducer';
import createMilestones from '../containers/milestones/reducers/create-milestones-reducer';
import moreMilestonesData from  '../containers/milestones/reducers/more-milestones-reducer';
import register from '../containers/register/reducers/register-reducer';
import issue from '../containers/issues/reducers/issue-reducer';

import getGroupTree from '../containers/project-mgr/reducers/group-tree-reducer';
import createGroup from '../containers/project-mgr/reducers/create-group-reducer';
import createProject from '../containers/project-mgr/reducers/create-project-reducer';
import getGroupMembers from '../containers/project-mgr/reducers/group_members_reducer';
import {consernProject, unconsernProject} from '../containers/project-list/reducers/consern-project-reducer';
import getProjectStar from '../containers/project-mgr/reducers/project-star-reducer';
import {getGroupInfo, getProjectInfo} from '../containers/project-mgr/reducers/select-treenode-reducer';
import fetchMergeData from '../containers/mergeRequest/reducers/fetch-datasource-reducer';
//import getTopNaviInfo from '../containers/top-navigation/reducers/select-topnavi-reducer';


const reducer = combineReducers({
    login,
    menu,
    milestones,
    getGroupTree,
    createMilestones,
    moreMilestonesData,
    createGroup,
    createProject,
    getGroupMembers,
    register,
    issue,
    consernProject,
    unconsernProject,
    getProjectStar,
    getGroupInfo,
    getProjectInfo,
    milestonesDetail,
    fetchMergeData,
    //getTopNaviInfo
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
    // return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension ? window.devToolsExtension() :f => f);
    return createStore(
        reducer,
        initialState,
        enhancer
        //applyMiddleware(sagaMiddleware(...sagas),router)
    );
}
