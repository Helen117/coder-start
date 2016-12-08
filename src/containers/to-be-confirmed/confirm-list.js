/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Table} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getConfirmList} from './action';



class ConfirmList extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const task_id = this.props.task_id
        if(task_id){
            this.props.getConfirmListAction(task_id);
        }

    }

    getDataSource(confirmList){
        if(confirmList){
            for(let i=0; i<confirmList.length; i++){
                confirmList[i].due_date = new Date(confirmList[i].due_date).toLocaleDateString();
                confirmList[i].created_at = new Date(confirmList[i].created_at).toLocaleDateString();
                if(confirmList[i].type == 'demand'){
                    confirmList[i].type = '需求';
                }
            }
        }
        return confirmList;
    }

    render() {
        const confirmList = this.props.confirmList;
        const loading = this.props.getConfirmListLoading?true:false;
        const pagination = {
            pageSize:20,
        };
        const data = this.getDataSource(confirmList)
        return(
                <Table columns={this.columns(this)} dataSource={data}
                       bordered
                       size="middle"
                       pagination={pagination}
                       loading={loading}
                />
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
    dataIndex: 'files',
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

function mapStateToProps(state) {
    return {
        getConfirmListLoading: state.toBeConfirmedItem.getConfirmListLoading,
        confirmList: state.toBeConfirmedItem.confirmList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getConfirmListAction: bindActionCreators(getConfirmList, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmList);