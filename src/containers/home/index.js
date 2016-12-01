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
import {acqPerformanceMsg,acqMyIssueList} from './actions/home-action'
//const Panel = Collapse.Panel;

//import PanelBox from '../../components/panel-box';

//import {Doughnut} from 'react-chartjs';

import './index.less'

class Home extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.props.acqPerformanceMsgAction(this.props.loginInfo.userId);
        this.props.acqMyIssueListAction(this.props.loginInfo.userId,'opened');
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

        const {performanceMsg,myIssueListLoading,performanceMsgLoading} = this.props;
        const params = {
            assigned_id: this.props.loginInfo.userId,
            state: 'opened'
        }
        let finished=0,unfinished=0;
        if(performanceMsg){
            finished = performanceMsg.finish;
            unfinished = performanceMsg.unfinish
        }
        const loading = (performanceMsgLoading|| myIssueListLoading)? true: false;
        return (
             <Spin spinning={loading} tip="正在加载数据，请稍候...">
                <Row className="ant-layout-content home-row">
                   {/* <Row style={{padding: 10}}>
                        <Col span={24}>
                            <MyProjectStatus state={1}/>
                        </Col>
                    </Row>*/}
                    <Row style={{padding: 10}}>
                        <Col span={24}>
                            <MyProjectRank rank={1}/>
                        </Col>
                    </Row>
                    <Row style={{padding: 10}}>
                        <Col span={9} offset={3}>
                            <MyProjectProgress label="我在本里程碑未完成工作的百分比" percent={unfinished}/>
                        </Col>
                        <Col span={9} offset={3}>
                            <MyProjectProgress label="我在本里程碑完成工作的百分比" percent={finished}/>
                        </Col>
                    </Row>
                </Row>
                <Row>
                   <Col  style={{paddingRight: 5}}>
                        <MyIssueList timeLineData={this.props.myIssueList}
                                     viewDetailParams={params} viewDetailPath = '/project-mgr/myIssue' />
                    </Col>
                    {/*
                    <Col span={12} style={{paddingLeft: 5}}>
                        <NewIssueList/>
                    </Col>*/}
                </Row>
                </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        performanceMsg:  state.acqPerformanceMsg.performanceMsg,
        performanceMsgLoading: state.acqPerformanceMsg.loading,
        myIssueList: state.acqMyIssueList.myIssueList,
        myIssueListLoading: state.acqMyIssueList.loading,
    }
}

function mapDispatchToProps(dispatch){
    return{
        acqPerformanceMsgAction: bindActionCreators(acqPerformanceMsg, dispatch),
        acqMyIssueListAction: bindActionCreators(acqMyIssueList, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);
