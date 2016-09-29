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
import { Button, Row, Col, notification } from 'antd';
import TreeFilter from '../../components/tree-filter';
import ProjectList from '../project-list/project-list';
import ProjectMember from '../project-list/member';
import ProjectItem from '../project-list/project-item';
import {getGroupTree} from './actions/group-tree-action';
import {getGroupMembers} from './actions/group_members_action';
import {getProjectStar} from './actions/project-star-action';
import {getGroupInfo,getProjectInfo} from './actions/select-treenode-action';
//import {getProjectInfo} from '../project-mgr/actions/select-treenode-action';
import 'pubsub-js';


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
            pathname: '/group-detail.html',
            state: {editType: type, selectedRow}
        });
    }
    editProject(type, selectedRow) {
        this.context.router.push({
            pathname: '/project-detail.html',
            state: {editType: type, selectedRow,
                    selectGroupName:this.state.selectGroupName,
                    selectGroupId:this.state.selectGroupId}
        });
    }


    onSelectNode(node){
        const {loginInfo,starList} = this.props;
        if(node.id.indexOf("_p") < 0){
            this.setState({
                selectGroupName:node.name,
                selectGroupId:node.id
            });
            this.props.getGroupMembers(node.id);
            this.props.getGroupInfo(node);
        }else{
            var node_p = {
                id:null,
                isLeaf:node.isLeaf,
                name:node.name
            };
            node_p.id = node.id.replace("_p","");
            this.props.getProjectInfo(node_p);
        }
        if(!starList){
            this.props.getProjectStar(loginInfo.username);
        }
        PubSub.publish("evtTreeClick",node);
    }

    render(){
        const {treeData, loading} = this.props;
        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loading}
                        notFoundMsg='找不到项目'
                        inputPlaceholder="快速查询项目"
                        loadingMsg="正在加载项目信息..."
                        nodesData={treeData}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    <Row>
                        <Button className="pull-right" type="primary" onClick={this.editGroup.bind(this, 'add', null)}>
                            新建项目组
                        </Button>
                        <Button className="pull-right" type="primary" onClick={this.editProject.bind(this, 'add', null)}>
                            新建项目
                        </Button>
                    </Row>
                    <Row>
                        <ProjectList />
                        <ProjectItem />
                        <ProjectMember />
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        getGroupMembers:bindActionCreators(getGroupMembers, dispatch),
        getProjectStar:bindActionCreators(getProjectStar, dispatch),
        getGroupInfo:bindActionCreators(getGroupInfo, dispatch),
        getProjectInfo:bindActionCreators(getProjectInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMgr);
