/**
 * Created by helen on 2016/10/31.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,notification  } from 'antd';
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
        actions.getApproveList(loginInfo.username);
    }

    componentWillReceiveProps(nextProps) {
        // const {errors} = nextProps;
        // if(errors&&errors!=this.props.errors){
        //     // message.error('获取待审批列表失败！'+errors,3);
        //     this.errorMessage('获取待审批列表失败！',errors);
        // }
    }

    // errorMessage(info,error){
    //     notification.error({
    //         message: info,
    //         description:error,
    //         duration:null,
    //     });
    // }

    approveDetail(record,type){
        let pathName = '';
        if(record.type=='领导审批'){
            pathName = '/approveRegister';
        }else if(record.type=='需求确认' ){
            if(type=='confirm') {
                pathName = '/confirmOperate'
            }else{
                pathName = '/transpondOperate'
            }
        }

        this.context.router.push({
            pathname: pathName,
            state: {record}
        });

    }

    render() {

        const pagination = {
            pageSize:20,
           // total: data.length,
        };

        return(
            <Box title="待审批列表">
                <Table columns={this.columns(this)} dataSource={this.props.approveList}
                       bordered
                       size="middle"
                       pagination={pagination}
                       loading={this.props.loading}
                       //onRowClick ={this.approveDetail.bind(this)}
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
    dataIndex: 'initiator',
},{
    title: '审批类型',
    dataIndex: 'type',
}, {
    title: '申请时间',
    dataIndex: 'created_at',
},{
    title: '操作',
    dataIndex: 'key',
    render: (text, record) => (
        record.type=="领导审批"?
            <a onClick={self.approveDetail.bind(self,record,'')}>审批</a>:
            <div>
                <a onClick={self.approveDetail.bind(self,record,'confirm')}>确认</a>
                <span style={{marginLeft:10, marginRight:10}}className="ant-divider" />
                <a onClick={self.approveDetail.bind(self,record,'transpond')}>转派</a>
            </div>

    )
}];


//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        approveList:state.approve.approveList,
        loading:state.approve.loading,
        loginInfo:state.login.profile,
        errors:state.approve.errors,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(approve,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ApproveList);