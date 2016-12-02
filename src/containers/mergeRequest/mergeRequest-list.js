/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import { Button,Row, Modal, Table,notification,Icon, Tooltip} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchMrListData} from './mergeRequest-action'

class MergeRequestList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.getProjectInfo) {
            if(!this.props.mrList && !this.props.loading) {
                this.props.fetchMrListData(this.props.getProjectInfo.id);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const thisProId = this.props.getProjectInfo?this.props.getProjectInfo.id:'';
        const nextProId = nextProps.getProjectInfo?nextProps.getProjectInfo.id:'';
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            this.props.fetchMrListData(nextProId);
        }
    }

    createMergeRequest(type){
        this.context.router.push({
            pathname: '/CreateMergeRequest',
            state: {editType: type}
        });
    }

    onChange(pagination, filters, sorter) {
        // 点击分页、筛选、排序时触发
    }

    getTime(date) {
        return new Date(parseInt(date)).toLocaleDateString();
    }


    getDataSource(mrList){
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
        const data = this.getDataSource(mrList);
        return(
            <div style={{margin: 10}}>
                <Row>
                <Button className="pull-right" type="primary"
                        disabled={this.props.getProjectInfo?false:true}
                        onClick={this.createMergeRequest.bind(this,'add')}>创建合并请求</Button>
                </Row>
                    <div style={{marginTop:10}}>
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

MergeRequestList.prototype.columns = (self)=> [{
    title: 'MR名称',
    dataIndex: 'mrTitle',
    key: 'mrTitle',
    width:'20%'
},{
    title: '申请人',
    dataIndex: 'author',
    key: 'author',
    width:'10%',
},{
    title: '处理人',
    dataIndex: 'assignee',
    key: 'assignee',
    width:'10%'
},{
    title: 'MR路径',
    dataIndex: 'mrPath',
    key: 'mrPath',
    width:'10%'
},{
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width:'10%',
},{
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width:'10%',
}/*,{
    title: '操作',
    dataIndex: 'opreation',
    width: '10%',
    render: (text, record, index)=> {
        return (
        record.state == "closed"?
            <span>
                <a onClick = {self.revertMr.bind(self,record)}>回退</a>
            </span>:
                <span></span>


        )
        ;
    }
}*/]

MergeRequestList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        getProjectInfo:state.getProjectInfo.projectInfo,
        mrList: state.mergeRequest.mrList,
        loading: state.mergeRequest.getMrListLoading
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchMrListData : bindActionCreators(fetchMrListData,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MergeRequestList);
