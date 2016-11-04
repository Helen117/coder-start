/**
 * Created by zhaojp on 2016/10/11.
 */
/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import {Button,Table, Modal,notification,Row, Icon, Tooltip, Spin} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetchBranchesData from './actions/fetch-branches-action';
import deleteBranch from './actions/branches-delete-action'

const confirm = Modal.confirm;
class branchesList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.getProjectInfo) {
            if(!this.props.branchesData) {
                this.props.fetchBranchesData(this.props.getProjectInfo.id);
            }
        }/*else{
            const {router} = this.context;
            router.goBack();
            this.errChosePro();
        }*/
    }

    componentWillReceiveProps(nextProps) {
        const fetchErrors = nextProps.fetchErrors;
        const delErrMessage = nextProps.delErrMessage;
        const delResult = nextProps.delResult;
        const thisProId = this.props.getProjectInfo?this.props.getProjectInfo.id:'';
        const nextProId = nextProps.getProjectInfo?nextProps.getProjectInfo.id:'';
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            this.props.fetchBranchesData(nextProId);
        }
        //数据加载错误提示
        if(this.props.fetchErrors != fetchErrors && fetchErrors){
            this.errCallback(fetchErrors);
        }
        if(this.props.delErrMessage != delErrMessage && delErrMessage){
            this.errCallback(delErrMessage);
        }else if(this.props.delResult != delResult && delResult){
            this.delSuccess();
            this.props.fetchBranchesData(thisProId);
        }
    }

    delSuccess(){
        const project_id = this.props.getProjectInfo.id;
        notification.success({
            message: '删除成功',
            description: '',
            duration: 1
        });
        this.props.fetchBranchesData(project_id);
    }

    errCallback(fetchErrors){
        notification.error({
            message: '数据加载失败',
            description: fetchErrors,
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

    createBranches(type){
        this.context.router.push({
            pathname: '/createBranches',
            state: {editType: type}
        });
    }

    deleteBranch(record){
        const branch = record.branch;
        const project_id = this.props.getProjectInfo.id;
        const deleteBranchAction = this.props.deleteBranchAction;
        confirm({
            title: '您是否确定要删除此分支',
            content: '删除之后分支内容将会被丢弃',
            onOk() {
                deleteBranchAction(branch,project_id);
            },
            onCancel() {
            }
        })
    }

    onChange(pagination, filters, sorter) {
        // 点击分页、筛选、排序时触发
    }

    mapBranchTable(branch){
        const data = [];
        if(branch != [] && branch){
            for (let i = 0; i < branch.branch.length; i++) {
                data.push({
                    key: branch.branch[i],
                    branch: branch.branch[i],
                });
            }
        }
        return data;
    }

    render(){
        const branch = this.props.branchesData;
        const data = this.mapBranchTable(branch);
        return(

            <div style={{margin:15}}>
                <Spin spinning={this.props.delLoading} tip="正在删除数据">
                    <Row>
                        <Button className="pull-right" type="primary"
                                disabled={this.props.getProjectInfo?false:true}
                                onClick={this.createBranches.bind(this,'add')}>创建分支</Button>
                    </Row>
                    <div style={{marginTop:5}}>
                        <Table loading = {this.props.loading}
                               onChange={this.onChange.bind(this)}
                               columns={columns(this)}
                               dataSource={data}
                                />
                    </div>
                </Spin>
            </div>
            )
    }
}

const columns = (self)=>[{
    title: '分支',
    dataIndex: 'branch',
    key: 'branch',
    //sorter: (a, b) => a.branch - b.branch
},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => (
        record.branch=="master"|| record.branch=="release" || record.branch=="dev"?
            <dev></dev>:
            <Tooltip placement="top" title="点击删除">
                <Icon type="delete" onClick={self.deleteBranch.bind(self,record)}/>
            </Tooltip>

    )
}]


branchesList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        getProjectInfo:state.getProjectInfo.projectInfo,
        branchesData: state.fetchBranches.branchesData,
        loading: state.fetchBranches.loading,
        fetchErrors: state.fetchBranches.fetchErrors,
        delLoading: state.deleteBranch.loading,
        delErrMessage: state.deleteBranch.errorMsg,
        delResult: state.deleteBranch.result
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchBranchesData : bindActionCreators(fetchBranchesData,dispatch),
        deleteBranchAction: bindActionCreators(deleteBranch,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(branchesList);
