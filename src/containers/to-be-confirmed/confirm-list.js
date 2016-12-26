/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Table} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getConfirmList} from './action';



export default class ConfirmList extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }


    render() {

        return(
            <div style={{margin:10}}>
                <Table columns={this.columns(this)}
                       dataSource={this.props.data}
                       bordered
                       size="middle"
                       pagination={false}
                />
            </div>
        );
    }
}

ConfirmList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


ConfirmList.prototype.columns = (self)=>[{
    title: '主题',
    dataIndex: 'name',
},{
    title: '描述',
    dataIndex: 'description',

},{
    title: '文件',
    dataIndex: 'filesName',
},{
    title: '类型',
    dataIndex: 'type',
    width: '10%'
},{
    title: '创建人',
    dataIndex: 'author',
    width: '10%'
}, {
    title: '创建时间',
    dataIndex: 'created_at',
    width: '10%'

},{
    title: '计划完成时间',
    dataIndex: 'due_date',
    width: '10%'

}];
