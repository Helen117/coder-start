/**
 * Created by zhaojp on 2017/1/4.
 */
/**
 * Created by helen on 2016/10/18.
 */
import React, {PropTypes,Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Table } from 'antd';

class RequestList extends Component {

    constructor(props) {
        super(props);
    }

    deleteRequest(record){
        this.props.deleteRequest(record);
    }

    changePage(pagination, filters, sorter) {
        this.props.onChange(pagination, filters, sorter)
    }

    editRequest(type,selectedRow){
        this.context.router.push({
            pathname: '/requestEdit',
            state: {editType:type,selectedRow}
        });
    }

    stateTranslate(state){
        switch(state){
            case 'open': return '待确认';
            case 'test_confirmed_running': return '待开发';
            case 'develop_running': return '开发中';
            case 'test_running': return '测试中';
            case 'bug_to_be_confirmed_running': return 'bug待确认';
            case 'bug_fix_running': return '修复bug中';
            case 'closed': return '已完成';
            default: return state;
        }
    }

    getDataSources(list){
        if(list&&list.length>0) {
            for (var i = 0; i < list.length; i++) {
                if (typeof(list[i].expect_due_date) == "number") {
                    list[i].expect_due_date = new Date(parseInt(list[i].expect_due_date)).toLocaleDateString();
                }
                if (typeof(list[i].deadline_date) == "number") {
                    list[i].deadline_date = new Date(parseInt(list[i].deadline_date)).toLocaleDateString();
                }
                if(list[i].labels&&list[i].labels.length>0){
                    list[i].label_names=[];
                    list[i].label_ids =[];
                    for(let j=0;j<list[i].labels.length;j++){
                        list[i].label_names.push(list[i].labels[j].name);
                        list[i].label_ids.push(list[i].labels[j].id);
                    }
                }
                list[i].label = list[i].label_names && list[i].label_names.length > 0 ? list[i].label_names + '' : '';
                list[i].label_id = list[i].label_ids && list[i].label_ids.length > 0 ? list[i].label_ids + '' : '';
                list[i].state= this.stateTranslate(list[i].state);
            }
        }
        return list;
    }

    render() {
        const {requirementListData,page} = this.props;
        const dataSource = requirementListData?this.getDataSources(requirementListData.sets_Demands):[];
        const pagination = {
            total: requirementListData?requirementListData.size: 0,
            current: page
        }
        return (
            <Table columns={this.columns(this)}
                   dataSource={dataSource}
                   size="middle"
                   pagination={pagination}
                   onChange={this.changePage.bind(this)}
                   loading={this.props.loading} />

        )

    }

}

RequestList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

RequestList.prototype.columns = (self)=>[{
    title: '里程碑',
    dataIndex: 'milestone_name',
},{
    title: '需求名称',
    dataIndex: 'title',
},  {
    title: '描述',
    dataIndex: 'description',
},{
    title: '指派人员',
    dataIndex: 'assignee',
    width: '10%',
    render: (text, record) => (
        <ul>
            <li>
                开发：{record.assignee_develop_name}
            </li>
            <li>
                测试：{record.assignee_test_name}
            </li>
        </ul>
    )
}, {
    title: '当前状态',
    dataIndex: 'state',
},{
    title: '业务范畴',
    dataIndex: 'label',
},{
    title: '文件',
    dataIndex: 'files',
}/*, {
 title: '需求确认时间',
 dataIndex: 'confirm_time',
 width: '12%',

 }*/, {
    title: '计划完成时间',
    dataIndex: 'expect_due_date',
},{
    title: '期望上线时间',
    dataIndex: 'deadline_date',
},{
    title: '操作',
    dataIndex: 'key',
    width: self.props.editable ? '8%':'0%',
    render: (text, record) => {
        const userLimits = self.props.loginInfo.name == record.author? true: false;
        const updateLimits = record.state=='已完成'?  true: false;
        const deleteLimits = record.state=='进行中'?  true: false;
        return (<div>

            {record.state=='已完成'?<div/>:
                record.state=='待确认'?<span> <a onClick={self.editRequest.bind(self, 'modify', record)}>修改</a>
                    <span style={{marginRight: 5, marginLeft: 5}} className="ant-divider"/>
                    <a onClick={self.deleteRequest.bind(self, record)}>删除</a>
               </span>: <a onClick={self.editRequest.bind(self, 'modify', record)}>修改</a>
            }
        </div>)

    }
}];

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestList);

