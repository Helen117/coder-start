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
import { Row, Col, Form } from 'antd';
import TreeFilter from '../../components/tree-filter';
import {getGroupTree, setSelectNode} from './actions/group-tree-action';
import {getGroupMembers} from './actions/group_members_action';
import {getGroupInfo,getProjectInfo} from './actions/select-treenode-action';
import {getProjectMembers} from './actions/project-members-action';
import 'pubsub-js';

export GroupDetail from './group-detail';
export ProjectDetail from './project-detail';

class ProjectMgr extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        const {loginInfo} =this.props;
        PubSub.subscribe("evtRefreshGroupTree",()=>this.props.getGroupTree(loginInfo.userId));
        const {treeData} = this.props;
        if (treeData.length == 0){
            this.props.getGroupTree(loginInfo.userId);
        }
    }

    searchGroupByGroupId(groupId,list){
        var groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                if(groupId == list[i].children[j].id){
                    groupInfo = list[i].children[j];
                    return groupInfo;
                }
            }
        }
    }

    searchGroupByProjectId(projectId,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                var project_cat = list[i].children[j];
                for(var k=0; k<project_cat.children.length; k++){
                    if(projectId == project_cat.children[k].id){
                        if(project_cat.id > 0){
                            groupInfo = project_cat;
                        }else{
                            groupInfo = {};
                        }
                        projectInfo = project_cat.children[k];
                        return {projectInfo,groupInfo}
                    }
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
        const {treeData, currentOneInfo, currentTwoInfo} = this.props;
        if((node.id.indexOf("_") < 0 && node.id > 0) || (node.id.indexOf("_g") > 0)){//点击项目组节点
            if(node.id.indexOf("_g") < 0){
                this.props.getGroupMembers(node.id);
            }
            const groupInfo = this.searchGroupByGroupId(node.id, treeData);
            this.props.getGroupInfo(groupInfo, node.id,node);
            PubSub.publish("onSelectProjectNode",{node:node, isProject:false});
            this.props.setSelectNode({node:node, isProject:false});
        }else if(node.id.indexOf("_") >= 0 && node.id.indexOf("_g") < 0){//点击项目节点
            var node_temp = node.id;
            const {groupInfo} = this.searchGroupByProjectId(node.id, treeData);
            this.props.getProjectInfo(node_temp.substr(0,node_temp.length-2));
            this.props.getGroupInfo(groupInfo, node.id,node);
            this.props.getProjectMembers(node_temp.substr(0,node_temp.length-2));
            PubSub.publish("onSelectProjectNode",{node:node, isProject:true});
            this.props.setSelectNode({node:node, isProject:true});
        }else{
            PubSub.publish("onSelectProjectNode",{node:node, isProject:false});
            this.props.setSelectNode({node:node, isProject:false});
        }
        if(currentOneInfo){//根据菜单链接控制路由
            if(!this.isEmptyObject(currentTwoInfo)){
                this.context.router.push({
                    pathname: currentTwoInfo.link,
                });
            }else{
                this.context.router.push({
                    pathname: currentOneInfo.link,
                });
            }
        }
        //this.props.setSelectNode(node.id);

    }

    render(){
        const {treeData, loading, selectNodeKey} = this.props;

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
                    {this.props.children}
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

ProjectMgr = Form.create()(ProjectMgr);

function mapStateToProps(state) {
    return {
        loading : state.getGroupTree.loading,
        treeData: state.getGroupTree.treeData,
        loginInfo:state.login.profile,
        selectNodeKey: state.getGroupInfo.selectedNode,
        currentOneInfo:state.getMenuBarInfo.currentOne,
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        setSelectNode: bindActionCreators(setSelectNode, dispatch),
        getGroupMembers:bindActionCreators(getGroupMembers, dispatch),
        getGroupInfo:bindActionCreators(getGroupInfo, dispatch),
        getProjectInfo:bindActionCreators(getProjectInfo, dispatch),
        getProjectMembers:bindActionCreators(getProjectMembers, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMgr);
