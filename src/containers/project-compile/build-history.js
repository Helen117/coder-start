/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/11/30
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Table, Tooltip, Input, Button, Alert, notification, Row, Col, Popover, Timeline, Icon} from 'antd';
import Box from '../../components/box';
import './build-history.less';
import {getBuildList, getCodeChanges} from './action';
import 'pubsub-js';
import moment from 'moment';

class ProjectBuildHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pagination: {
                current: 1,
                pageSize: 10
            }
        };
    }

    componentWillMount(){
    }
    componentDidMount(){
        this.loadBuildList();
        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));
    }
    componentWillUnmount(){
        PubSub.unsubscribe("onSelectProjectNode");
    }

    componentWillReceiveProps(nextProps){
    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    componentWillUpdate(nextProps, nextState){

    }
    componentDidUpdate(prevProps, prevState){
    }

    selectProject(msg, data){
        if (data.isProject){
            this.props.getBuildList(data.node.id.substr(0,data.node.id.length-2));
        }
    }

    getDataSource(list){
        const data =[];
        if(list){
            if(list.rows&&list.rows.length>0){
                for(let i=0;i<list.rows.length;i++){
                    const dataSources ={};
                    dataSources.projectId=list.rows[i].projectId;
                    dataSources.jobName = list.rows[i].jobName;
                    dataSources.key = list.rows[i].buildNumber;
                    dataSources.gitCommitId=list.rows[i].gitCommitId;
                    dataSources.lastTimeGitCommitId=list.rows.length-i>1?list.rows[i+1].gitCommitId:'';
                    dataSources.codeChanges = list.rows[i].codeChanges;
                    if(list.rows[i].buildDetails&&list.rows[i].buildDetails.length>0){
                        dataSources.startTime=list.rows[i].buildDetails[0].startTime;
                        dataSources.commit = "changes";
                        for(let j=0;j<list.rows[i].buildDetails.length;j++){
                            let stageId = "stageId_"+list.rows[i].buildDetails[j].stageId;
                            let status = stageId + '_status';
                            let errorMsg = stageId + '_errorMsg';
                            dataSources[stageId]=list.rows[i].buildDetails[j].durationDesc;
                            dataSources[status] = list.rows[i].buildDetails[j].status;
                            dataSources[errorMsg] = list.rows[i].buildDetails[j].errorMsg;
                        }
                    }
                    data.push(dataSources);
                }
            }
        }
        return data;
    }

    getColumns(stages){
        let columns = [{
                title: '',
                colSpan: 1,
                dataIndex: 'startTime',
                width: 80
        }];
        if (!stages){
            return columns;
        }
        const self = this;
        let widthPercent = 100;
        if (stages.length > 0){
            widthPercent = 100/stages.length;
        }
        for (let i in stages){
            let stage = stages[i];
            columns.push({
                title: stage.name,
                dataIndex: 'stageId_'+stage.id,
                width: widthPercent+'%',
                render(text,record){
                    var statusClass = self.bgColor(record['stageId_'+stage.id+'_status']);
                    if (record['stageId_'+stage.id+'_status'] == 2) {
                        return <div className={statusClass}>
                            <Tooltip placement="top" title={record['stageId_'+stage.id+'_errorMsg']}>
                                <span>{text}</span>
                            </Tooltip>
                        </div>
                    };
                    if (stage.id == 1){
                        let commitDetailItems = [];
                        const codeChanges = record.codeChanges;
                        for (let i = codeChanges.length - 1; i >= 0; i--){
                            //const time = moment(codeChanges[i].created_at).utcOffset('+0800').format('YYYY-MM-DD HH:mm:ss');
                            const time = moment(codeChanges[i].created_at).format('YYYY-MM-DD HH:mm:ss');
                            commitDetailItems.push(
                                <Timeline.Item key={i} dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>
                                    <p>{time} 【{codeChanges[i].author_name} 提交】</p>
                                    <p><code>{codeChanges[i].title}</code></p>
                                </Timeline.Item>
                            );
                        };
                        const commitDetail = (
                            <section className="markdown">
                                <Timeline>
                                    {commitDetailItems}
                                </Timeline>
                            </section>
                        );
                        return (
                            <Popover content={commitDetail} title={<h4>代码提交记录</h4>} placement="rightTop" arrowPointAtCenter>
                                <div className={statusClass} style={{cursor:'pointer'}}>
                                    <span style={{textDecoration: 'underline'}}>{text}</span>
                                </div>
                            </Popover>
                        );
                    }else{
                        return <div className={statusClass}>
                            <span>{text}</span>
                        </div>;
                    };
                }
            });
        }
        return columns;
    }

    bgColor(status){
        let statusClass = 'not-run';
        if (status == 2) {
            statusClass = 'run-failed';
        }else if(status == 1){
            statusClass = 'run-successful';
        }else if(status == 0){
            statusClass = 'running';
        }
        return statusClass;
    }

    loadBuildList(){
        const {selectNode, getBuildList} = this.props;
        if (selectNode && selectNode.isProject){
            getBuildList(selectNode.node.id.substr(0,selectNode.node.id.length-2));
        }
    }

    render(){
        const {selectNode, buildList} = this.props;
        const action = (selectNode&&selectNode.isProject && buildList)?
            (<Button type="primary" size="default" onClick={this.loadBuildList.bind(this)}>刷新</Button>
            ):(<div/>);
        return (
            <Box title="最近5次编译发布情况" action={action}>
                {(selectNode&&selectNode.isProject && buildList)?(
                    <div id="mytable">
                        <Table columns={this.getColumns.bind(this,buildList.stages)()} dataSource={this.getDataSource(buildList.data)}
                               loading={buildList && buildList.isLoading}
                               pagination={false}
                        >
                        </Table>
                        <div className="legend">
                            <div className="run-failed">执行失败</div>
                            <div className="run-successful">执行成功</div>
                            <div className="running">执行中</div>
                            <div className="not-run">未执行</div>
                            <span>图例：</span>
                        </div>
                    </div>
                ):(
                    <Alert
                        message="请从左边的项目树中选择一个具体的项目进行查看！"
                        description=""
                        type="warning"
                        showIcon
                    />
                )}
            </Box>
        );
    }

}

ProjectBuildHistory.contextTypes = {
};

ProjectBuildHistory = Form.create()(ProjectBuildHistory);

function mapStateToProps(state) {
    return {
        selectNode: state.getGroupTree.selectNode,
        buildList: state.projectCompile.buildList
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getBuildList: bindActionCreators(getBuildList, dispatch),
        getCodeChanges: bindActionCreators(getCodeChanges, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBuildHistory);
