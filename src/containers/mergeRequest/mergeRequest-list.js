/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import { Button,Row, Modal, Table,notification,Icon, Tooltip} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchMrListData,fetchMergeBranchData,fetchIssuesData} from './mergeRequest-action'

class MergeRequestList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        if(projectInfo.id) {
            if(!this.props.mrList && !this.props.loading) {
                this.props.fetchMrListData(projectInfo.id);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {mergeBranch,issues} = nextProps;
        const {project} = this.props;
        const next_project = nextProps.project;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        let next_projectInfo = next_project.getProjectInfo?(
            next_project.getProjectInfo.projectInfo?next_project.getProjectInfo.projectInfo:{}
        ):{};
        const thisProId = projectInfo.id;
        const nextProId = next_projectInfo.id;
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId){
            this.props.fetchMrListData(nextProId);
        }
        if(this.props.mergeBranch != mergeBranch && mergeBranch){
            if(mergeBranch.length >1){
                const userId = this.props.loginInfo.userId;
                this.props.fetchIssuesData(mergeBranch[1].id,userId);
            }else{
                this.errCallback('无需合并','该项目是根节点，无需向其他项目合并代码');
            }
        }

        if(this.props.issues != issues && issues){
            console.log('issues',this.props.issues, issues)
            if(issues.length >0 ){
                this.context.router.push({
                    pathname: '/CreateMergeRequest',
                    state: {editType: 'add'}
                });
            }else{
                this.errCallback('无需合并','您当前无待办事项，不能代码合并请求');
            }

        }
    }

    errCallback(type,errMessage,){
        notification.error({
            message: type,
            description:errMessage,
            duration: null
        });
    }

    createMergeRequest(){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const projectId = projectInfo.id;
        this.props.fetchMergeBranchData(projectId);
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
                    description: mrList[i].description,
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
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        return(
            <div style={{margin: 10}}>
                <Row>
                    <Button className="pull-right" type="primary"
                            disabled={projectInfo.id?false:true}
                            onClick={this.createMergeRequest.bind(this)}>
                        创建合并请求
                    </Button>
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

MergeRequestList.prototype.columns = (self)=> [{
    title: 'MR名称',
    dataIndex: 'mrTitle',
    key: 'mrTitle',
    width:'20%'
},{
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width:'25%'
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
    width:'15%'
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
        mergeBranch : state.mergeRequest.mergeBranch,
        issues: state.mergeRequest.Issues,
        mrList: state.mergeRequest.mrList,
        loading: state.mergeRequest.getMrListLoading,
        loginInfo:state.login.profile,
        project:state.project,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchMrListData : bindActionCreators(fetchMrListData,dispatch),
        fetchMergeBranchData : bindActionCreators(fetchMergeBranchData,dispatch),
        fetchIssuesData : bindActionCreators(fetchIssuesData,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MergeRequestList);
