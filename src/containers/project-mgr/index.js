/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, {PropTypes} from 'react';
import { Button, Row, Col } from 'antd';
import TreeFilter from '../../components/tree-filter';
import ProjectList from '../project-list';
import ProjectItem from '../project-item';

export GroupDetail from './group-detail';

export class ProjectMgr extends React.Component{
    constructor(props){
        super(props);
    }

    editGroup(type, selectedRow) {
        this.context.router.push({
            //pathname: window.location.pathname + '/edit',
            pathname: '/project-group',
            state: {editType: type, selectedRow}
        });
    }

    render(){
        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter />
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