/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/8
 */

import React, {PropTypes} from 'react';
import {Table, Button} from 'antd';
import Box from '../../components/Box';

import './index.less';


const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `李大嘴${i}`,
        gender: '男',
        age: 32,
        address: `西湖区湖底公园${i}号`,
        description: `我是李大嘴${i}，今年32岁，住在西湖区湖底公园${i}号`
    });
}

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],  // 这里配置默认勾选列
            loading: false,
        };
        this.clickBtn = this.clickBtn.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    componentWillMount() {

    }

    toggleLoading() {
        this.setState({
            loading: !this.state.loading
        });
    }

    clickBtn() {
        this.setState({loading: true});
        let self = this;
        //模拟 ajax 请求，完成后清空
        setTimeout(() => {
            self.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }

    onSelectChange(selectedRowKeys) {
        this.setState({selectedRowKeys});
    }

    rowClassName(record, index) {
        if (index == 1) {
            return 'success';
        }
        if (index == 4) {
            return 'info';
        }
        if (index == 6) {
            return 'warning';
        }
        if (index == 8) {
            return 'danger';
        }
    }

    editUser(type, selectedRow) {
        this.context.router.push({
            pathname: window.location.pathname + '/edit',
            state: {editType: type, selectedRow}
        });
    }

    render() {
        const pagination = {
            total: data.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange(current) {
                console.log('Current: ', current);
            },
        };
        const {loading, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        if (this.props.children) {
            return React.cloneElement(this.props.children, {hello: 1});
        } else {
            return (
                <Box title="用户列表">
                    <div style={{marginBottom: 16}}>
                        <Button onClick={this.editUser.bind(this, 'add', null)}>添加</Button>
                        <Button type="primary" onClick={this.clickBtn} disabled={!hasSelected} loading={loading}>
                            删除
                        </Button>
                        <span style={{marginLeft: 8}}>{hasSelected ? `选择了 ${selectedRowKeys.length} 条记录` : ''}</span>
                        <Button className="pull-right" type="primary" onClick={this.toggleLoading.bind(this)}>
                            切换loading状态
                        </Button>
                    </div>
                    {/*columns={this.userListColumns.bind(this,this)()}*/}
                    <Table rowSelection={rowSelection} columns={this.userListColumns(this)} dataSource={data}
                           bordered={false}
                           showHeader={true}
                           size="middle"
                           pagination={pagination}
                           expandedRowRender={record=><p>{record.description}</p>}
                           loading={this.state.loading}
                           rowClassName={this.rowClassName}
                    />
                </Box>
            );
        }

    }
}

UserList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UserList.prototype.userListColumns = (self)=>[{
    title: '姓名',
    dataIndex: 'name',
    width: '20%'
}, {
    title: '性别',
    dataIndex: 'gender',
    width: '15%',
}, {
    title: '年龄',
    dataIndex: 'age',
    width: '15%'
}, {
    title: '住址',
    dataIndex: 'address',
    width: '30%',
    //className: 'warning',
    render(text, record, index){
        const style = {};
        if (index == 2) {
            style.color = 'red';
            style.backgroundColor = 'yellow';
        }
        return <span style={style}>{text}</span>;
    }
}, {
    title: '操作',
    dataIndex: 'key',
    width: '20%',
    render: (text, record, index)=> {
        return <Button type="ghost" onClick={self.editUser.bind(self, 'modify', record)}>修改</Button>;
    }
}];