/**
 * Created by Administrator on 2016-09-14.
 */
import React from 'react';
import {Table} from 'antd';

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
}, {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
}];

const data = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
}, {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
}, {
    key: '3',
    name: '李大嘴',
    age: 32,
    address: '西湖区湖底公园1号',
}];

export default class TableTest extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Table columns={columns} dataSource={data} />
            </div>
        )
    }
}