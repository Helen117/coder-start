/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import { Button,Row, Modal, Table,notification,Icon, Tooltip} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetchMrListData from './actions/mergeRequest-list-action'
import {acceptMr,closeMr} from './actions/mergeRequest-edit-action';

class mergeRequestList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.getProjectInfo) {
            if(!this.props.mrList) {
                this.props.fetchMrListData(this.props.getProjectInfo.id);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const errMessage = nextProps.errMessage;
        const thisProId = this.props.getProjectInfo?this.props.getProjectInfo.id:'';
        const nextProId = nextProps.getProjectInfo?nextProps.getProjectInfo.id:'';
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            this.props.fetchMrListData(nextProId);
        }
        //数据加载错误提示
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback('数据加载失败',errMessage);
        }
    }

    errCallback(type,errMessage){
        notification.error({
            message: type,
            description: errMessage,
            duration: 2
        });
    }

    createMergeRequest(type){
            this.context.router.push({
                pathname: '/createMergeRequest',
                state: {editType: type}
            });
    }

    onChange(pagination, filters, sorter) {
        // 点击分页、筛选、排序时触发
    }

    getTime(date) {
        return new Date(parseInt(date)).toLocaleDateString();
    }

    closeMr(record){
        //console.log('close',record);
        const project_id = this.props.getProjectInfo.id;
        const id = record.key;
        //this.props.closeMrAction(project_id,id);
    }

    acceptMr(record){
        //console.log('merge',record);
        const project_id = this.props.getProjectInfo.id;
        const id = record.key;
        //this.props.acceptMrAction(project_id,id);
    }

    mapMrList(mrList){
        const data = [];
        if(mrList != [] && mrList){
            for (let i = 0; i < mrList.length; i++) {
                data.push({
                    key: mrList[i].id,
                    mrTitle: mrList[i].title,
                    author: mrList[i].author.name,
                    assignee:mrList[i].assignee,
                    mrPath:mrList[i].source_branch+' to '+mrList[i].target_branch,
                    created_at:this.getTime(mrList[i].created_at),
                    milestone:mrList[i].milestone,
                    state:mrList[i].state
                });
            }
        }
        return data;
    }

    render(){
        const mrList = this.props.mrList;
        const data = this.mapMrList(mrList);
        return(
            <div style={{marginTop:15,marginLeft:30}}>
                <Row>
                <Button className="pull-right" type="primary"
                        disabled={this.props.getProjectInfo?false:true}
                        onClick={this.createMergeRequest.bind(this,'add')}>创建合并请求</Button>
                </Row>
                    <div style={{marginTop:5}}>
                    <Table loading = {this.props.loading}
                           onChange={this.onChange.bind(this)}
                           columns={this.columns(this)}
                           dataSource={data}
                    />
                </div>
            </div>
                )
    }
}

mergeRequestList.prototype.columns = (self)=> [{
    title: 'MR名称',
    dataIndex: 'mrTitle',
    key: 'mrTitle',
    width:'20%'
},{
    title: '申请人',
    dataIndex: 'author',
    key: 'author',
    width:'7%'
},{
    title: '处理人',
    dataIndex: 'assignee',
    key: 'assignee',
    width:'7%'
},{
    title: 'MR路径',
    dataIndex: 'mrPath',
    key: 'mrPath',
    width:'10%'
},{
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width:'7%',
},{
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width:'5%',
},{
    title: '操作',
    dataIndex: 'opreation',
    width: '10%',
    render: (text, record, index)=> {
        return (
        record.state == "opened"?
            <span>
                <a onClick = {self.closeMr.bind(self,record)}>关闭</a>
                <span style={{marginLeft:10,marginRight:10}}className="ant-divider" />
                <a onClick = {self.acceptMr.bind(self,record)}>合并</a>
            </span>:
                <span></span>


        )
        ;
    }
}]

mergeRequestList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        getProjectInfo:state.getProjectInfo.projectInfo,
        mrList: state.fetchMrList.mrList,
        loading: state.fetchMrList.loading
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchMrListData : bindActionCreators(fetchMrListData,dispatch),
        acceptMrAction: bindActionCreators(acceptMr,dispatch),
        closeMrAction: bindActionCreators(closeMr,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(mergeRequestList);
