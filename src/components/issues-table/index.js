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
            return new Date(parseInt(date)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        }else{
            return '';
        }
    }
    onChange(pagination, filters, sorter) {
        // 点击分页、筛选、排序时触发
        console.log('各类参数是', pagination, filters, sorter);
    }

    //处理表格数据源
    getDataSource(dataSource){
        const data = [];
        if(dataSource !=null){
            for (let i = 0; i < dataSource.length; i++) {
                data.push({
                    title: dataSource[i].title,
                    author_name: dataSource[i].author.name,
                    assignee_name: dataSource[i].assignee.name,
                    created_at:  this.getTime(dataSource[i].created_at),
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
    width: '12.5%',
}, {
    title: '创建人',
    dataIndex: 'author_name',
    width: '12.5%',
},{
    title: '修复人',
    dataIndex: 'assignee_name',
    width: '12.5%',
},{
    title: '问题标签',
    dataIndex: 'labels',
    width: '12.5%',
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
}];
