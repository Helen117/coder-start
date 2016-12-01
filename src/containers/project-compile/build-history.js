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
import {Form, Table, Tooltip, Input, Button, Alert, notification, Row, Col} from 'antd';
import Box from '../../components/box';
import './build-history.less';
import {getBuildList} from './action';
import 'pubsub-js';

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
        const {selectNode, getBuildList} = this.props;
        if (selectNode && selectNode.isProject){
            getBuildList(selectNode.node.id.substr(0,selectNode.node.id.length-2));
        }
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
                    if(list.rows[i].buildDetails&&list.rows[i].buildDetails.length>0){
                        dataSources.startTime=list.rows[i].buildDetails[0].startTime;
                        dataSources.gitCommitId=list.rows[i].buildDetails[0].gitCommitId;
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
                    // console.log("dataSources:",dataSources);
                    data.push(dataSources);
                }
            }
        }
        // console.log('data:',data);
        return data;
    }

    bgColor(status){
        console.log("status:",status);
        let style={};
        if (status == '2') {
            style ={backgroundColor: "#ffb6c1",color:"red"};
        }else if(status == '1'){
            style ={backgroundColor: "#f0fff0"};
        }else if(status == '0'){
            style ={backgroundColor: "#6ADAFF"};
        }else{
            style ={backgroundColor: "#e9e9e9"};
        }
        return style;
    }


    render(){
        const {selectNode, buildList} = this.props;
        return (
            <Box title="查看编译发布历史">
                {(selectNode&&selectNode.isProject && buildList)?(
                    <div id="mytable">
                        <Table columns={this.columns(this)} dataSource={this.getDataSource(buildList)}
                               loading={buildList && buildList.isLoading}
                               pagination={false}
                        >
                        </Table>
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

ProjectBuildHistory.prototype.columns = (self)=>[
    {
        title: '',
        colSpan: 1,
        dataIndex: 'startTime',
        width: 80,
    // },{
    //     colSpan: 0,
    //     dataIndex: 'commit',
    //     width: '8%',
    //     render(text,record){
    //         // if(text.indexOf("没变更")!=-1){
    //         //     return <span>{text}</span>
    //         // }else{
    //         return <a onClick={self.codeChange.bind(self,text,record)}>{text}</a>
    //         // }
    //     }
    },
    {
        title: '更新代码',
        dataIndex: 'stageId_1',
        width: '10%',
        render(text,record){
            var  divStyle = self.bgColor(record.stageId_1_status);
            if (record.stageId_1_status == '2') {
                return <div style={divStyle}>
                    <Tooltip placement="top" title={record.stageId_1_errorMsg}>
                        <span>{text}</span>
                    </Tooltip>
                </div>
            }
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    },
    {
        title: '编译',
        dataIndex: 'stageId_100',
        width: '10%',
        render(text,record){
            var divStyleFun = self.bgColor.bind(self,record.stageId_100_status);
            var divStyle = divStyleFun();
            if (record.stageId_100_status == '2') {
                return <div style={divStyle}>
                    <Tooltip placement="top" title={record.stageId_100_errorMsg}>
                        <span>{text}</span>
                    </Tooltip>
                </div>
            }
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }, {
        title: '生成单元测试案例',
        dataIndex: 'generating_test_case',
        width: '10%',
        render(text,record){
            // return <a onClick={self.stageDetail.bind(self,text,record)}>{text}</a>
            var  divStyle = self.bgColor(record);
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }, {
        title: '代码质量扫描',
        dataIndex: 'code_quality_scan',
        width: '10%',
        render(text,record){
            var  divStyle = self.bgColor(record);
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }, {
        title: '单元测试',
        dataIndex: 'unit_test',
        width: '10%',
        render(text,record){
            var  divStyle = self.bgColor(record);
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }, {
        title: '打包',
        dataIndex: 'package',
        width: '10%',
        render(text,record){
            var  divStyle = self.bgColor(record);
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }, {
        title: '生成镜像',
        dataIndex: 'generated_mirror',
        width: '10%',
        render(text,record){
            var  divStyle = self.bgColor(record);
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }, {
        title: '发布',
        dataIndex: 'stageId_200',
        width: '10%',
        render(text,record){
            var  divStyle = self.bgColor(record.stageId_200_status);
            if (record.stageId_200_status == '2') {
                return <div style={divStyle}>
                    <Tooltip placement="top" title={record.stageId_200_errorMsg}>
                        <span>{text}</span>
                    </Tooltip>
                </div>
            }
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }, {
        title: '执行自动化测试',
        dataIndex: 'auto_test',
        width: '10%',
        render(text,record){
            var  divStyle = self.bgColor(record);
            return <div style={divStyle}>
                <span>{text}</span>
            </div>
        }
    }];

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
        getBuildList: bindActionCreators(getBuildList, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBuildHistory);
