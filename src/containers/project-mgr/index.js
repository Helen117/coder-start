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
import ProjectList from '../project-list';
import ProjectMember from '../project-list/member';
import {getGroupTree} from './actions/group-tree-action';
import {getGroupMembers} from './actions/group_members_action';
import 'pubsub-js';


export GroupDetail from './group-detail';
export ProjectDetail from './project-detail';

class ProjectMgr extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        const {loginInfo} =this.props;
        PubSub.subscribe("evtRefreshGroupTree",()=>this.props.getGroupTree(loginInfo.username));
        //PubSub.subscribe("evtRefreshGroupTree",()=>this.props.getGroupTree());
        const {treeData} = this.props;
        if (!treeData){
            this.props.getGroupTree(loginInfo.username);
            //this.props.getGroupTree();
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
            state: {editType: type, selectedRow,}
        });
    }


    onSelectNode(node){
        this.props.getGroupMembers(node.id);
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        getGroupMembers:bindActionCreators(getGroupMembers, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMgr);
