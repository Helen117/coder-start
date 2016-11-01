/**
 * Created by helen on 2016/10/31.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,Select,DatePicker,Table,Collapse  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as approve from './actions/approve-action';

class ApproveList extends Component {

    constructor(props) {
        super(props);
        this.state = {selectedRows: [],};
    }

    componentWillMount() {
        const {loginInfo,actions} = this.props;
        actions.getApproveList(loginInfo.userId);
    }

    componentWillReceiveProps(nextProps) {
        const {loginInfo,actions} = this.props;
        const nextResult = nextProps.result;
        const nextError = nextProps.error;
        const commit = nextProps.commitLoading;

        if(nextError&& nextError != this.props.error){
            message.error('提交失败！'+error,3);
            actions.getApproveList(loginInfo.userId);
        }
        if (!commit && !nextError && nextResult && nextResult!=this.props.result) {
            message.success('提交成功！');
            actions.getApproveList(loginInfo.userId);
        }
    }

    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ 'selectedRows':selectedRows });
    }

    approve(type,selectedRows){
        const {actions} = this.props;

        if(type=='agree'){
            for(let i=0;i<selectedRows.length;i++){
                selectedRows[i].status=1;
            }

            actions.approveResult(selectedRows);
        }else{
            for(let i=0;i<selectedRows.length;i++){
                selectedRows[i].status=2;
            }
            actions.approveResult(selectedRows);
        }
    }

    render() {

        const {selectedRows} = this.state;

        const rowSelection = {
            selectedRows,
            onChange: this.onSelectChange.bind(this),
        };
        const hasSelected = selectedRows&&selectedRows.length > 0;

        const pagination = {
            pageSize:10,
           // total: data.length,
        };

        return(
            <Box title="注册审批">
                <Table rowSelection={rowSelection} columns={this.columns(this)} dataSource={this.props.approveList}
                       bordered={false}
                       size="middle"
                       pagination={pagination}
                       loading={this.props.loading}
                />
                <div style={{marginTop: 16}}>
                    <Button type="primary" onClick={this.approve.bind(this, 'agree', selectedRows)} disabled={!hasSelected} loading={this.props.commitLoading}>同意</Button>
                    <Button type="primary" onClick={this.approve.bind(this, 'disagree', selectedRows)} disabled={!hasSelected} loading={this.props.commitLoading}>
                        不同意
                    </Button>
                </div>
            </Box>
        );
    }
}

ApproveList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


ApproveList.prototype.columns = (self)=>[{
    title: '姓名',
    dataIndex: 'name',
    width: '20%'
},{
    title: '登录名',
    dataIndex: 'username',
    width: '20%',
}, {
    title: '注册时间',
    dataIndex: 'created_at',
    width: '20%'
}, {
    title: '状态',
    dataIndex: 'description',
    width: '20%',
}, {
    title: '申请角色',
    dataIndex: 'role_name',
    width: '20%',
}];


//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        approveList:state.approve.approveList,
        loading:state.approve.loading,
        commitLoading:state.approve.commitLoading,
        result:state.approve.approveResult,
        error:state.approve.resultErrors,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(approve,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ApproveList);