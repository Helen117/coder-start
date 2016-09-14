/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React from 'react';
import {Row, Col, Collapse, Alert} from 'antd';
import {
    MyProjectProgress,
    MyProjectRank,
    MyProjectStatus,
    MyIssueList,
    NewIssueList
} from '../../components/dashboard';

//const Panel = Collapse.Panel;

//import PanelBox from '../../components/panel-box';

//import {Doughnut} from 'react-chartjs';

import './index.less'


export default class Home extends React.Component {

    constructor() {
        super()
    }

    componentWillMount() {
    }

    callback() {

    }

    render() {
        return (
            <div>
                <Row className="ant-layout-content home-row">
                    <Row style={{padding: 10}}>
                        <Col span={24}>
                            <MyProjectStatus state={1}/>
                        </Col>
                    </Row>
                    <Row style={{padding: 10}}>
                        <Col span={24}>
                            <MyProjectRank rank={1}/>
                        </Col>
                    </Row>
                    <Row style={{padding: 10}}>
                        <Col span={12}>
                            <MyProjectProgress label="我今日在该项目中需完成工作的百分比" percent={0}/>
                        </Col>
                        <Col span={12}>
                            <MyProjectProgress label="我在本里程碑完成工作的百分比（不参与竞赛的员工由项目经理设定）" percent={75}/>
                        </Col>
                    </Row>
                </Row>
                <Row>
                    <Col span={12} style={{paddingRight: 5}}>
                        <MyIssueList />
                    </Col>
                    <Col span={12} style={{paddingLeft: 5}}>
                        <NewIssueList/>
                    </Col>
                </Row>
            </div>
        );
    }
}
