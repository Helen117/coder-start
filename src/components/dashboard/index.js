/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/6 14:14
 */
import React, {PropTypes} from 'react';
import {Timeline, Progress, Icon, Row, Col, Steps} from 'antd';
import Box from '../../components/Box';
import ThumbnailView from '../../components/thumbnail-view';

import './index.less'

export class MyIssueList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box title="分配给我的待处理问题列表">
                <Timeline pending={<a href="#">查看更多</a>}>
                    <Timeline.Item>待处理问题1待处理问题1待处理问题1 2016-09-06</Timeline.Item>
                    <Timeline.Item>待处理问题2待处理问题2待处理问题2 2016-09-06</Timeline.Item>
                    <Timeline.Item>待处理问题3待处理问题3待处理问题3 2016-09-06</Timeline.Item>
                    <Timeline.Item>待处理问题4待处理问题4待处理问题4 2016-09-06</Timeline.Item>
                    <Timeline.Item>待处理问题5待处理问题5待处理问题5 2016-09-06</Timeline.Item>
                </Timeline>
            </Box>
        );
    }

}


export class MyProjectProgress extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {label, percent} = this.props;
        return (
            <div className="progress-container">
                <Progress type="circle" percent={percent} format={percent=>percent + '%'}/>
                <span className="progress-label">{label}</span>
            </div>
        );
    }
}

MyProjectProgress.propTypes = {
    label: PropTypes.string.isRequired,
    percent: PropTypes.number
};


export class MyProjectRank extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {rank} = this.props;
        return (
            <Row>
                <Col span={5}>
                    <Icon type="github" style={{marginRight: 8}}/>
                    <span style={{fontWeight: 'bold'}}>我在本项目中的绩效排名</span>
                </Col>
                <Col span={5}>
                    第 <label style={{color: 'red'}}>{rank}</label> 名
                </Col>
            </Row>
        );
    }
}

MyProjectRank.propTypes = {
    rank: PropTypes.number.isRequired
};


export class MyProjectStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {state} = this.props;
        const Step = Steps.Step;
        return (
            <Row>
                <Col span={5}>
                    <Icon type="apple" style={{marginRight: 8}}/>
                    <span style={{fontWeight: 'bold'}}>所关注项目的当前状态</span>
                </Col>
                <Col span={12}>
                    <Steps current={state} size="small">
                        <Step title="状态1" description=""/>
                        <Step title="状态2" description=""/>
                        <Step title="状态3" description=""/>
                        <Step title="状态4" description=""/>
                    </Steps>
                </Col>
            </Row>
        );

    }
}

MyProjectStatus.propTypes = {
    state: PropTypes.number.isRequired
};

export class NewIssueList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box title="所关注项目的最新问题">
                <Row>
                    <Col span={8}>
                        <ThumbnailView caption="问题一" content="我是内容我是内容111我是内容我是内容111我是内容我是内容111"/>
                    </Col>
                    <Col span={8}>
                        <ThumbnailView caption="问题二" content="我是内容我是内容222我是内容我是内容222我是内容我是内容222"/>
                    </Col>
                    <Col span={8}>
                        <ThumbnailView caption="问题三" content="我是内容我是内容333我是内容我是内容333"/>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <ThumbnailView caption="问题四" content="我是内容我是内容444我是内容我是内容444"/>
                    </Col>
                    <Col span={8}>
                        <ThumbnailView caption="问题五" content="我是内容我是内容555我是内容我是内容555"/>
                    </Col>
                    <Col span={8}>
                        <ThumbnailView caption="问题六" content="我是内容我是内容666我是内容我是内容666"/>
                    </Col>
                </Row>
            </Box>
        );
    }

}