/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,notification  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';

export default class ConfirmList extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }


    getDetail(record){
        // console.log(record);
        this.context.router.push({
            pathname: '/confirmOperate',
            state: {record}
        });

    }

    render() {

        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        const data = [{
            "name":"项目优化",
            "type":"需求",
            "author":"孙磊",
            "created_at":"2016/11/23"
        }];

        return(
            <Box title="待确认事项列表">
                <Table columns={this.columns(this)} dataSource={data}
                       bordered
                       size="middle"
                       pagination={pagination}
                    //loading={this.props.loading}
                       onRowClick ={this.getDetail.bind(this)}
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
}];
