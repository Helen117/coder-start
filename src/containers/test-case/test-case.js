/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,notification,Button,Modal  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';

const confirm = Modal.confirm;
export default class TestCase extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    editTestCase(type, selectedRow){
        this.context.router.push({
            pathname: '/testCaseEdit',
            state: {editType: type, selectedRow}
        });
    }

    delTestCase(record) {
        confirm({
            title: '您是否确定要删除此测试案例？',
            onOk() {

            },
            onCancel() {
            }
        })
    }

    render() {

        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        const data = [{
            "case_name":"流量",
            "test_type":"功能测试",
            "test_function":"折线图",
            "test_step":"1、方法。2份额",
            "test_data":"项目优化",
            "validation_method":"数据验证",
            "sql":"select ",
            "expected_result":"数据一致"
        }];

        return(
            <Box title="测试案例">
                <Button type="primary" onClick={this.editTestCase.bind(this,'add',null)}>新增</Button>
                <Table columns={this.columns(this)} dataSource={data}
                       bordered
                       size="middle"
                       pagination={pagination}
                    //loading={this.props.loading}

                />
            </Box>
        );
    }
}

TestCase.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


TestCase.prototype.columns = (self)=>[{
    title: '案例名称',
    dataIndex: 'case_name',
},{
    title: '测试类型',
    dataIndex: 'test_type',
}, {
    title: '测试功能',
    dataIndex: 'test_function',
},{
    title: '测试步骤（需要具体到流程名）',
    dataIndex: 'test_step',
},{
    title: '测试数据',
    dataIndex: 'test_data',
}, {
    title: '验证方法',
    dataIndex: 'validation_method',
},{
    title: '相关SQL',
    dataIndex: 'sql',
}, {
    title: '预期结果',
    dataIndex: 'expected_result',
},{
    title: '操作',
    dataIndex: 'key',
    width: '8%',
    render: (text, record, index)=> {
        return <div>
            <a onClick={self.editTestCase.bind(self,'modify', record)}>修改</a><br/>
            <a onClick={self.delTestCase.bind(self, record)}>删除</a>
        </div>;
    }
}];
