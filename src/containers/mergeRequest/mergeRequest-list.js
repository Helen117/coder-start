/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import { Button,Row, Radio, Table,notification,Alert, Col} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchMrListData,fetchMergeBranchData,fetchIssuesData,changeQueryCondition} from './mergeRequest-action'

class MergeRequestList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {project} = this.props;
        const projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        if(projectInfo.id) {
            if(!this.props.mrList || this.props.mrList.project_id!=projectInfo.id){
                console.log('componentWillMount')
                this.props.changeQueryConditionAction(1,'opened')
                this.props.fetchMrListData(projectInfo.id,1,'opened');
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {mergeBranch,issues} = nextProps;
        const {project} = this.props;
        const next_project = nextProps.project;
        const projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        const next_projectInfo = next_project.getProjectInfo?(
            next_project.getProjectInfo.projectInfo?next_project.getProjectInfo.projectInfo:{}
        ):{};
        const thisProId = projectInfo.id;
        const nextProId = next_projectInfo.id;
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId) {
            this.props.fetchMrListData(nextProId, 1,'opened');
            this.props.changeQueryConditionAction(1,'opened')
        }

        if(this.props.mergeBranch != mergeBranch && mergeBranch){
            if(mergeBranch.length >1){
                const userId = this.props.loginInfo.userId;
                this.props.fetchIssuesData(mergeBranch[0].id,userId);
            }
        }

        if(this.props.issues != issues && issues){
            if(issues.length >0 ){
                this.context.router.push({
                    pathname: '/CreateMergeRequest',
                    state: {record: '',projectId:mergeBranch[0].id}
                });
            }else{
                this.errCallback('无需合并','您当前在该项目下无待办事项，不能请求代码合并');
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
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const projectId = projectInfo.id;
        this.props.fetchMergeBranchData(projectId,'','');
    }

    onChange(pagination, filters, sorter) {
        // 点击分页、筛选、排序时触发

        this.props.changeQueryConditionAction(pagination.current,this.props.status)
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        if(projectInfo.id) {
            this.props.fetchMrListData(projectInfo.id,pagination.current,this.props.status);
        }
    }

    handleSizeChange(e){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        if(projectInfo.id){
            this.props.changeQueryConditionAction(1, e.target.value);
            this.props.fetchMrListData(projectInfo.id,1,e.target.value);
        }

    }

    getCodeChanges(record){
        const projectId = this.props.mrList.project_id;
        this.context.router.push({
            pathname: '/codeChanges',
            state: {
                record: record,
                projectId: projectId
            }
        });

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
                    assignee:mrList[i].assignee?mrList[i].assignee.name:'',
                    mrPath:mrList[i].source_branch+' to '+mrList[i].target_branch,
                    created_at:this.getTime(mrList[i].created_at),
                    milestone:mrList[i].milestone,
                    state:mrList[i].state=='opened'?'未合并':mrList[i].state=='merged'?'已合并':'已关闭'
                });
            }
        }
        return data;
    }

    render(){
        const {mrList,selectNode,project,fetchIssueLoading,mergeBranchLoading,loginInfo} = this.props;
        const data = mrList?this.getDataSource(mrList.gitlabMergeRequests):null;
        const buttonLoading = fetchIssueLoading || mergeBranchLoading;
        const pagination = {
            total: mrList?mrList.size:0,
            current: this.props.page
        }
        const projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        if(selectNode && selectNode.isProject){
            return(
                <div style={{margin: 10}}>
                    <Row>
                        <Col span="12">
                        <Button type="primary"
                                disabled={projectInfo&&projectInfo.forks_from&&projectInfo.owner_id==loginInfo.userId?false:true}
                                loading={buttonLoading}
                                onClick={this.createMergeRequest.bind(this)}>
                            创建合并请求
                        </Button>
                        </Col>

                        <Col span="12">
                            <div style={{textAlign:"right"}}>
                                <Radio.Group size="default" value={this.props.status} onChange={this.handleSizeChange.bind(this)}>
                                    <Radio.Button value="opened">未合并</Radio.Button>
                                    <Radio.Button value="merged">已合并</Radio.Button>
                                    <Radio.Button value="closed">已关闭</Radio.Button>
                                    <Radio.Button value="all">全部</Radio.Button>
                                </Radio.Group>
                                </div>
                        </Col>

                    </Row>
                    <div style={{marginTop:5}}>
                        <Table loading = {this.props.loading}
                               onChange={this.onChange.bind(this)}
                               columns={this.columns(this)}
                               dataSource={data}
                               pagination={pagination}
                        />
                    </div>
                </div>
            )
        }else{
            return(
                <Alert style={{marginLeft:10}}
                   message="请从左边的项目树中选择一个具体的项目！"
                   description=""
                   type="warning"
                   showIcon
            />
            )
        }


    }
}

MergeRequestList.prototype.columns = (self)=> [{
    title: '主题',
    dataIndex: 'mrTitle',
    key: 'mrTitle',
    width:'20%',
    render: (text, record, index)=> {
        return (
            <a onClick = {self.getCodeChanges.bind(self,record)}>{record.mrTitle}</a>
        )
    }
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
        mergeBranchLoading: state.mergeRequest.mergeBranchLoading,
        mergeBranch : state.mergeRequest.mergeBranch,
        fetchIssueLoading: state.mergeRequest.fetchIssueLoading,
        issues: state.mergeRequest.Issues,
        mrList: state.mergeRequest.mrList,
        loading: state.mergeRequest.getMrListLoading,
        status: state.mergeRequest.status,
        page: state.mergeRequest.page,
        loginInfo:state.login.profile,
        project:state.project,
        selectNode: state.getGroupTree.selectNode,
    };
}

function mapDispatchToProps(dispatch){
    return{
        changeQueryConditionAction: bindActionCreators(changeQueryCondition,dispatch),
        fetchMrListData : bindActionCreators(fetchMrListData,dispatch),
        fetchMergeBranchData : bindActionCreators(fetchMergeBranchData,dispatch),
        fetchIssuesData : bindActionCreators(fetchIssuesData,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MergeRequestList);
