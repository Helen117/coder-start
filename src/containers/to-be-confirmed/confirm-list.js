/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,notification} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import {getConfirmList} from './actions/confirm-list-action'

class ConfirmList extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getConfirmListAction(this.props.loginInfo.userId);
    }

    componentWillReceiveProps(nextProps) {

    }

    accept(record){
        console.log('record',record)
        this.context.router.push({
            pathname: '/confirmOperate',
            state: {record}
        });
    }

    transpond(record){
        this.context.router.push({
            pathname: '/transpondOperate',
            state: {record}
        });
    }

    handleOk(){

    }

    handleCancel(){

    }

    render() {
console.log('this.props.loading',this.props.loading);
        const loading = this.props.loading?this.props.loading:false;
        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        const data = [{
            "name":"项目优化",
            "type":"需求",
            "author":"孙磊",
            "due_date": "2016/11/29",
            "created_at":"2016/11/23",
            "files":'qwe'
        }];

        return(
            <Box title="待确认事项列表">
                <Table columns={this.columns(this)} dataSource={data}
                       bordered
                       size="middle"
                       pagination={pagination}
                       loading={this.props.loading}
                />
            </Box>
        );
    }
}

ConfirmList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


ConfirmList.prototype.columns = (self)=>[{
    title: '工单名称',
    dataIndex: 'name',
},{
    title: '类型',
    dataIndex: 'type',
},{
    title: '创建人',
    dataIndex: 'author',
}, {
    title: '创建时间',
    dataIndex: 'created_at',
},{
    title: '计划完成时间',
    dataIndex: 'due_date',
},{
    title: '文件',
    dataIndex: 'files',
},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => (
        <span>
            <a onClick={self.accept.bind(self,record)}>确认</a>
            <span className="ant-divider" />
            <a onClick={self.transpond.bind(self,record)}>转派</a>
        </span>

    )
}];

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        loading: state.getConfirmList.loading,
        dataSource: state.getConfirmList.item,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getConfirmListAction: bindActionCreators(getConfirmList, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmList);