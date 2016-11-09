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
        this.state = {};
    }

    componentWillMount() {
        const {loginInfo,actions} = this.props;
        actions.getApproveList(loginInfo.userId);
    }

    approveDetail(record, index){
        console.log(record);
        this.context.router.push({
            pathname: '/approveRegister',
            state: {record}
        });

    }

    render() {

        const pagination = {
            pageSize:10,
           // total: data.length,
        };

        return(
            <Box title="待审批列表">
                <Table columns={this.columns(this)} dataSource={this.props.approveList}
                       bordered
                       size="middle"
                       pagination={pagination}
                       loading={this.props.loading}
                       onRowClick ={this.approveDetail.bind(this)}
                />
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
    title: '申请人',
    dataIndex: 'name',
},{
    title: '审批类型',
    dataIndex: 'description',
}, {
    title: '申请时间',
    dataIndex: 'created_at',
}];


//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        approveList:state.approve.approveList,
        loading:state.approve.loading,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(approve,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ApproveList);