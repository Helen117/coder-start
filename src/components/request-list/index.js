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
import api from '../../api';

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

    typeTranslate(state){
        switch(state){
            case 'demand': return '需求';
            case 'defect': return '缺陷';
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
                list[i].state = this.stateTranslate(list[i].state);
                list[i].types = this.typeTranslate(list[i].type);
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
                   loading={this.props.loading}
                   scroll={{ x: this.props.editable ?1400: 1000 }}/>

        )

    }

}

RequestList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

RequestList.prototype.columns = (self)=>[
    {
        title: '需求主题',
        dataIndex: 'title',
        width: 150,
        fixed: self.props.editable ? 'left': false,
    },  {
        title: '描述',
        dataIndex: 'description',
        fixed: self.props.editable ? 'left': false,
        width: 150,
    },{
        title: '文件',
        dataIndex: 'files',
        render: (text, record) => {
            var url = api.opts.baseURI+"/attachfile/download?fileName="+text;
            return <div>
                <a href={url}>{text}</a>
            </div>
        }
    },{
        title: '类型',
        dataIndex: 'types',
        width: 70,
    },{
        title: '里程碑',
        dataIndex: 'milestone_name',
    },{
        title: '指派人员',
        dataIndex: 'assignee',
        width: 90,
        render: (text, record) => (
            <ul>
                <li>
                    {record.assignee_develop_name? ("开发："+record.assignee_develop_name): ''}
                </li>
                <li>
                    {record.assignee_test_name? ('测试：'+record.assignee_test_name): ''}
                </li>
            </ul>
        )
    }, {
        title: '计划完成时间',
        dataIndex: 'expect_due_date',
        width: 90,
    },{
        title: '期望上线时间',
        dataIndex: 'deadline_date',
        width: 90,
    }, {
        title: '当前状态',
        dataIndex: 'state',
        width: 90,
    },{
        title: '业务范畴',
        dataIndex: 'label',
    },{
        title: 'iimp工单号',
        dataIndex: 'iimp_id',
    },{
        title: 'iimp子工单号',
        dataIndex: 'iimp_sub_id',
    },{
        title: '操作',
        dataIndex: 'key',
        fixed: self.props.editable ? 'right': false,
        width: self.props.editable ? 100:'0%',
        render: (text, record) => {
            return (<div>
                {   (record.state=='已完成' || record.story_id) ? <div/>:
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

export default connect(mapStateToProps)(RequestList);

