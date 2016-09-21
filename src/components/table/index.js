/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {Table} from 'antd';
import styles from './index.css';
import 'PubSub-js';

export default class TableView extends Component{
    constructor(props){
        super(props);
    }

    selectRow(record, index){
        console.log("record:",record);
        console.log("index:",index);
        PubSub.publish("evtRowClick",{record:record});
    }

    render(){
        const pagination = {
            total: this.props.dataSource.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange(current) {
                console.log('Current: ', current);
            },
        };

        return(
            <div className={styles.table_view_div}>
                <Table columns={this.props.columns}
                       dataSource={this.props.dataSource}
                       bordered
                       size="middle"
                       pagination={pagination}
                       onRowClick={this.selectRow}/>
            </div>
        )
    }
}