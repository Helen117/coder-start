/**
 * Created by zhaojp on 2016/9/26.
 */
/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import { Table,Button } from 'antd';


export default class IssuesTable extends React.Component {

    constructor(props) {
        super(props);
    }

    //时间戳转换成日期
    getTime(date) {
        if(date != null) {
            return new Date(parseInt(date)).toLocaleDateString();
        }else{
            return '';
        }
    }
    onChange(pagination, filters, sorter) {
        // 点击分页、筛选、排序时触发
    }

    //处理表格数据源
    getDataSource(dataSource){
        const data = [];
        if(dataSource != [] && dataSource){
            for (let i = 0; i < dataSource.length; i++) {
                data.push({
                    title: dataSource[i].title,
                    author_name: dataSource[i].author?dataSource[i].author.name:null,
                    assignee_name: dataSource[i].assignee?dataSource[i].assignee.name:null,
                    created_at: this.getTime(dataSource[i].created_at),
                    due_date: this.getTime(dataSource[i].due_date),
                    labels: dataSource[i].labels,
                    state: dataSource[i].state,
                });
            }
        }
        return data;
    }

    render(){
        return(
            <Table columns={this.milestoneListColumns(this)}
                   dataSource={this.getDataSource(this.props.dataSource)}
                   bordered={false}
                   showHeader={true}
                   size="middle"
                   loading = {this.props.loading}
                   onChange={this.onChange.bind(this)} >
            </Table>
        )
    }
}

IssuesTable.prototype.milestoneListColumns = (self)=>[{
    title: '问题名称',
    dataIndex: 'title',
    width: '15%',
    sorter: (a, b) => a.title - b.title,
}, {
    title: '创建人',
    dataIndex: 'author_name',
    width: '10%',
    sorter: (a, b) => a.author_name - b.author_name,
},{
    title: '修复人',
    dataIndex: 'assignee_name',
    width: '10%',
    sorter: (a, b) => a.assignee_name - b.assignee_name,
},{
    title: '问题标签',
    dataIndex: 'labels',
    width: '15%',
    sorter: (a, b) => a.labels - b.labels,
}, {
    title: '问题创建时间',
    dataIndex: 'created_at',
    width: '12.5%',
    sorter: (a, b) => a.created_at.length - b.created_at.length,
}, {
    title: '计划完成时间',
    dataIndex: 'due_date',
    width: '12.5%',
    sorter: (a, b) => a.due_date - b.due_date,
},{
    title: '状态',
    dataIndex: 'state',
    width: '12.5%',
    sorter: (a, b) => a.state - b.state,
}];
