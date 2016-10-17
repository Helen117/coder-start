/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix } from 'antd';
import TreeFilter from '../../components/tree-filter';
import {getGroupTree, setSelectNode} from './actions/group-tree-action';
import {getGroupMembers} from './actions/group_members_action';
import {getProjectStar} from './actions/project-star-action';
import {getGroupInfo,getProjectInfo} from './actions/select-treenode-action';
import 'pubsub-js';
import * as Cookies from "js-cookie";

export GroupDetail from './group-detail';
export ProjectDetail from './project-detail';

class ProjectMgr extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectGroupName:null,
            selectGroupId:null
        };
    }

    componentDidMount() {
        const {loginInfo} =this.props;
        PubSub.subscribe("evtRefreshGroupTree",()=>this.props.getGroupTree(loginInfo.username));
        const {treeData} = this.props;
        if (!treeData){
            this.props.getGroupTree(loginInfo.username);
        }
    }

    editGroup(type, selectedRow) {
        this.context.router.push({
            pathname: '/project-mgr/group-detail',
            state: {editType: type, selectedRow}
        });
    }
    editProject(type, selectedRow) {
        this.context.router.push({
            pathname: '/project-mgr/project-detail',
            state: {editType: type, selectedRow,}
        });
    }

    searchGroupByGroupId(groupId,list){
        var groupInfo;
        for(var i=0;i<list.length;i++){
            if(groupId == list[i].id){
                groupInfo = list[i];
                return groupInfo;
            }
        }
    }

    searchGroupByProjectId(projectId,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                if(projectId == list[i].children[j].gitlabProject.id){
                    groupInfo = list[i];
                    projectInfo = list[i].children[j];
                    return {projectInfo,groupInfo}
                }
            }
        }
    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    onSelectNode(node){
        const {loginInfo, starList, list, currentOneInfo, currentTwoInfo} = this.props;
        if(node.id.indexOf("_p") < 0){
            this.props.getGroupMembers(node.id);
            const groupInfo = this.searchGroupByGroupId(node.id, list);
            this.props.getGroupInfo(groupInfo, node.id);
        }else{
            var node_p = node.id.replace("_p","");
            const {projectInfo, groupInfo} = this.searchGroupByProjectId(node_p, list);
            this.props.getProjectInfo(projectInfo);
            this.props.getGroupInfo(groupInfo, node.id);
        }
        if(!starList){
            this.props.getProjectStar(loginInfo.username);
        }
        if(currentOneInfo){
            if(!this.isEmptyObject(currentTwoInfo)){
                if(currentTwoInfo.link == '/project-mgr'){
                    if(node.id.indexOf("_p") < 0){
                        this.context.router.push({
                            pathname: '/project-mgr/project-list',
                            state: {node}
                        });
                    }else{
                        this.context.router.push({
                            pathname: '/project-mgr/project-item',
                            state: {node}
                        });
                    }
                }else{
                    if(node.id.indexOf("_p") >= 0){
                        this.context.router.push({
                            pathname: currentTwoInfo.link,
                        });
                    }
                }
            }else{
                this.context.router.push({
                    pathname: currentOneInfo.link,
                });
            }
        }
        //this.props.setSelectNode(node.id);

    }

    render(){
        const {treeData, loading, currentTwoInfo, selectNodeKey} = this.props;
        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loading}
                        notFoundMsg='找不到项目'
                        inputPlaceholder="快速查询项目"
                        loadingMsg="正在加载项目信息..."
                        nodesData={treeData}
                        defaultSelectedKeys={[selectNodeKey]}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    {(!this.isEmptyObject(currentTwoInfo) && currentTwoInfo.link == '/project-mgr')?(
                        <Row>
                            <Button className="pull-right" type="primary" onClick={this.editGroup.bind(this, 'add', null)}>
                                新建项目组
                            </Button>
                            <Button className="pull-right" type="primary" onClick={this.editProject.bind(this, 'add', null)}>
                                新建项目
                            </Button>
                        </Row>
                    ):(<div></div>)}
                    <Row>
                        {this.props.children}
                    </Row>
                </Col>
            </Row>
        );
    }

}

ProjectMgr.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loading : state.getGroupTree.loading,
        treeData: state.getGroupTree.treeData,
        loginInfo:state.login.profile,
        starList:state.getProjectStar.starList,
        list: state.getGroupTree.treeData,
        selectNodeKey: state.getGroupInfo.selectedNode,
        currentOneInfo:state.getMenuBarInfo.currentOne,
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        //setSelectNode: bindActionCreators(setSelectNode, dispatch),
        getGroupMembers:bindActionCreators(getGroupMembers, dispatch),
        getProjectStar:bindActionCreators(getProjectStar, dispatch),
        getGroupInfo:bindActionCreators(getGroupInfo, dispatch),
        getProjectInfo:bindActionCreators(getProjectInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMgr);
