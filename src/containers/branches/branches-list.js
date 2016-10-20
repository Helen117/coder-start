/**
 * Created by zhaojp on 2016/10/11.
 */
/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import {Button,Table, Modal,notification} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetchBranchesData from './actions/fetch-branches-action';

class branchesList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.getProjectInfo) {
            if(!this.props.branchesData) {
                this.props.fetchBranchesData(this.props.getProjectInfo.gitlabProject.id);
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
            this.props.fetchBranchesData(nextProId);
        }
        //数据加载错误提示
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }
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
                <div>
                    <Button type="primary"  onClick={this.createBranches.bind(this,'add')}>创建分支</Button>

                </div>
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
    title: '分支',
    dataIndex: 'branch',
    key: 'branch',
    sorter: (a, b) => a.branch - b.branch
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
        loading: state.fetchBranches.loading
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchBranchesData : bindActionCreators(fetchBranchesData,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(branchesList);
