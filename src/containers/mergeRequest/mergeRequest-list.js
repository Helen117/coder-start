/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import { Button,Row, Modal, Table,notification} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetchMrListData from './actions/mergeRequest-list-action'

class mergeRequestList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.getProjectInfo) {
            if(!this.props.mrList) {
                this.props.fetchMrListData(this.props.getProjectInfo.gitlabProject.id);
            }
        }else{
            const {router} = this.context;
            router.goBack();
            this.errChosePro();
        }
    }

    componentWillReceiveProps(nextProps) {
        const errMessage = nextProps.errMessage;
        const thisProId = this.props.getProjectInfo.gitlabProject.id;
        const nextProId = nextProps.getProjectInfo.gitlabProject.id;
        //点击不同项目，重新加载数据
        if(thisProId != nextProId){
            this.props.fetchMrListData(nextProId);
        }
        //数据加载错误提示
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }
    }

    errCallback(errMessage){
        notification.error({
            message: '数据加载失败',
            description: errMessage,
            duration: 2
        });
    }

    errChosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在“代码管理“中选择一个项目！',
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

    mapMrList(mrList){
        const data = [];
        if(mrList != [] && mrList){
            for (let i = 0; i < mrList.length; i++) {
                data.push({
                    key: mrList[i].id,
                    mrTitle: mrList[i].title,
                    author: mrList[i].author.name,
                    assignee:mrList[i].assignee,
                    mrPath:mrList[i].source_project_id+'/'+mrList[i].source_branch+' to '+ mrList[i].project_id+'/'+mrList[i].target_branch,
                    created_at:this.getTime(mrList[i].created_at),
                    milestone:mrList[i].milestone,
                    state:mrList[i].state
                });
            }
        }
        return data;
    }

    render(){
        console.log('mrList',this.props.mrList);
        const mrList = this.props.mrList;
        const data = this.mapMrList(mrList);
        return(
            <div style={{marginTop:15,marginLeft:30}}>
                <Row>
                <Button className="pull-right" type="primary"  onClick={this.createMergeRequest.bind(this,'add')}>创建MR</Button>
                </Row>
                    <div style={{marginTop:5}}>
                    <Table loading = {this.props.loading}
                           onChange={this.onChange.bind(this)}
                           columns={columns}
                           dataSource={data}
                    />
                </div>
            </div>
                )
    }
}

const columns = [{
    title: 'MR名称',
    dataIndex: 'mrTitle',
    key: 'mrTitle',
    width:'10%'
},{
    title: '申请人',
    dataIndex: 'author',
    key: 'author',
    width:'10%'
},{
    title: '处理人',
    dataIndex: 'assignee',
    key: 'assignee',
    width:'10%'
},{
    title: 'MR路径',
    dataIndex: 'mrPath',
    key: 'mrPath',
    width:'30%'
},{
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width:'10%',
},{
    title: '里程碑',
    dataIndex: 'milestone',
    key: 'milestone',
    width:'10%',
},{
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    /*filters: [
        { text: 'opened', value: 'opened' },
        { text: 'closed', value: 'closed' },
    ],
    onFilter: (value, record) => record.name.indexOf(value) === 0,*/
    width:'10%',
},{
    title: '操作',
    dataIndex: 'opreation',
    width: '10%',
    render: (text, record, index)=> {
        return <div>
            <a >关闭</a><br/>
            <a >修改</a>
        </div>;
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
        fetchMrListData : bindActionCreators(fetchMrListData,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(mergeRequestList);
