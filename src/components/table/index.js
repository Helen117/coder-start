/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {Table} from 'antd';
import styles from './index.css';

export default class TableView extends Component{
    constructor(props){
        super(props);
    }

    selectRow(record, index){
        const {onRowClick} = this.props;
        if (onRowClick){
            onRowClick(record);
        }
    }

    onChange(pagination, filters, sorter){
        const parentOnChange = this.props.onChange;
        if(parentOnChange){
            parentOnChange(pagination, filters, sorter);
        }
    }

    render(){
        const pagination = {
            total: this.props.dataSource.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
            },
            onChange(current) {
            },
        };

        return(
            <div className={styles.table_view_div}>
                <Table columns={this.props.columns}
                       dataSource={this.props.dataSource}
                       bordered={this.props.bordered ? true:false}
                       size="middle"
                       pagination={pagination}
                       onRowClick={this.selectRow.bind(this)}
                       loading={this.props.loading}
                       onChange={this.onChange.bind(this)}/>
            </div>
        )
    }
}