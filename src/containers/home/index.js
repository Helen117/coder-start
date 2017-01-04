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
import {acqPerformanceMsg,acqMyIssueList,acqUserRanking} from './actions/home-action'
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
        this.props.acqUserRankingAction(this.props.loginInfo.userId);
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

        const {performanceMsg,myIssueListLoading,performanceMsgLoading,myRank,myRankLoading} = this.props;
        const params = {
            assigned_id: this.props.loginInfo.userId,
            state:'open_reopened',
            to_do_issues_type:'today_or_all',
        };
        let finished=0,unfinished=0,rank=0;
        if(performanceMsg){
            finished = performanceMsg.finish;
            unfinished = performanceMsg.unfinish
        }
        if(myRank){
            rank = myRank[0];
        }
        const loading = (performanceMsgLoading|| myIssueListLoading || myRankLoading)? true: false;
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
                            <MyProjectRank rank={rank}/>
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
                 <Row style={{height:'10px',backgroundColor:'#ECECEC'}}></Row>
                <Row>
                   <Col  style={{paddingRight: 5}}>
                        <MyIssueList timeLineData={this.props.myIssueList}
                                     viewDetailParams={params} viewDetailPath = '/myIssue' />
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
        performanceMsgLoading: state.acqPerformanceMsg.performanceMsgLoading,
        myIssueList: state.acqPerformanceMsg.myIssueList,
        myIssueListLoading: state.acqPerformanceMsg.myIssueListLoading,
        myRank: state.acqPerformanceMsg.myRank,
        myRankLoading: state.acqPerformanceMsg.myRankLoading,
    }
}

function mapDispatchToProps(dispatch){
    return{
        acqPerformanceMsgAction: bindActionCreators(acqPerformanceMsg, dispatch),
        acqMyIssueListAction: bindActionCreators(acqMyIssueList, dispatch),
        acqUserRankingAction: bindActionCreators(acqUserRanking, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);
