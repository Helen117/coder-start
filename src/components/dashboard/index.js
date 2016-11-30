/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/6 14:14
 */
import React, {PropTypes} from 'react';
import {Timeline, Progress, Icon, Row, Col, Steps} from 'antd';
import Box from '../../components/box';
import ThumbnailView from '../../components/thumbnail-view';

import './index.less'

export class MyIssueList extends React.Component {
    constructor(props) {
        super(props);
    }

    setTimeLineColor(dueDate){
        let color = 'blue';
        console.log(new Date(dueDate), new Date(),new Date(dueDate) > new Date())
        if(new Date(dueDate) < new Date()){
            color = 'red'
        }
        return color;
    }

    mapTimeLineData(timeLineData){
        let data = [];
        if(timeLineData) {
            data.push(
                timeLineData.map((item, index)=> {
                    const color = this.setTimeLineColor(item.dueDate);
                    return(
                        <Timeline.Item color={color}>
                            <span>{new Date(parseInt(item.dueDate)).toLocaleDateString()}--{item.title}</span>
                        </Timeline.Item>
                    )
                })
            )
        }
        return data;
    }

    myIssueDetail(){
        this.context.router.push({
            pathname: this.props.viewDetailPath,
            state: this.props.viewDetailParams
        });
    }

    render() {
        const timeLineData = this.mapTimeLineData(this.props.timeLineData);
        const isPending = this.props.timeLineData && this.props.timeLineData.length > 0 ? true : false;

            return (
                <Box title="分配给我的待处理问题列表">
                    <div style={{height:250}}>
                        {isPending? <Timeline pending={<a onClick={this.myIssueDetail.bind(this)}>查看更多</a>}>{timeLineData}</Timeline>:
                        <div>
                            <span><Icon type="exclamation-circle-o" />   您当前无待办事项</span>
                        </div>}
                    </div>
                </Box>
            );
    }

}
MyIssueList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


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
                <div style={{height:250}}>
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
                </div>
            </Box>
        );
    }

}