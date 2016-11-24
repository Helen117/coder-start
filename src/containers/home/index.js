/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {Row, Col, Spin, Collapse, Alert,Form,notification} from 'antd';
import {
    MyProjectProgress,
    MyProjectRank,
    MyProjectStatus,
    MyIssueList,
    NewIssueList
} from '../../components/dashboard';
import {connect} from 'react-redux';
import {acqPerformanceMsg} from './actions/home-action'
//const Panel = Collapse.Panel;

//import PanelBox from '../../components/panel-box';

//import {Doughnut} from 'react-chartjs';

import './index.less'

class Home extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        console.log('this.props.loginInfo.userId',this.props.loginInfo.userId);
        //this.props.acqPerformanceMsgAction(this.props.logInfo.userId);
    }
    componentDidMount(){
    }

    componentWillReceiveProps(nextProps) {

    }

    errCallback(errMessage,type){
        //message.error(type+'失败',errMessage);
        notification.error({
            message: type,
            description: errMessage,
            duration: 2
        });
    }

    callback() {

    }

    render() {
        const performanceMsg = this.props.performanceMsg;
        const loading = this.props.performanceMsgLoading? true: false;
        return (
            <Spin spinning={loading} tip="正在加载数据,请稍候..." >
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
                                <MyProjectProgress label="我在本里程碑完成工作的百分比" percent={75}/>
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
            </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        performanceMsg:  state.acqPerformanceMsg.performanceMsg,
        performanceMsgLoading: state.acqPerformanceMsg.loading,
        performanceMsgLoadingErrors: state.acqPerformanceMsg.errors
    }
}

function mapDispatchToProps(dispatch){
    return{
        acqPerformanceMsgAction: bindActionCreators(acqPerformanceMsg, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);
