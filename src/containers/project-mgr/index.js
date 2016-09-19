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
import { Button, Row, Col } from 'antd';
import TreeFilter from '../../components/tree-filter';
import ProjectList from '../project-list';
import ProjectItem from '../project-item';
import {getGroupTree} from './actions/group-tree-action';
import 'PubSub-js';


export GroupDetail from './group-detail';

class ProjectMgr extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.props.getGroupTree();
    }

    editGroup(type, selectedRow) {
        this.context.router.push({
            //pathname: window.location.pathname + '/edit',
            pathname: '/project-group',
            state: {editType: type, selectedRow}
        });
    }


    onSelectNode(node){
        console.info(node);
        PubSub.publish("evtTreeClick",{node:node});
    }

    render(){
        const {treeData} = this.props;
        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter nodesData={treeData} onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    <Row>
                        <Button className="pull-right" type="primary" onClick={this.editGroup.bind(this, 'add', null)}>
                            新建项目组
                        </Button>
                        <Button className="pull-right" type="primary">
                            新建项目
                        </Button>
                    </Row>
                    <Row>
                        <ProjectList />
                        <ProjectItem />
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
        treeData: state.getGroupTree.treeData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupTree: bindActionCreators(getGroupTree, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMgr);
