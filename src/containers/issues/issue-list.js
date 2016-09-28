/**
 * Created by helen on 15016/9/19.
 */
import React, {PropTypes,Component} from 'react';
import { Table ,Button} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';

const authName =[];
class IssueList extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {
        //console.info('componentDidMount');
        const {actions} = this.props;
        actions.getIssueList(17);
    }

    // editIssue() {
    //     this.context.router.replace('/issueEdit.html');
    // }
    editIssue(type, selectedRow) {
        //console.log('window.location:',window.location);
        this.context.router.push({
            pathname: '/issueEdit.html',
            state: {editType: type, selectedRow}
        });
    }

    issueNotes(record) {
        //this.context.router.replace('/issueNotes.html');
        console.log('record:',record);
        this.context.router.push({
            pathname: '/issueNotes.html',
            state: {record}
        });
    }


    //时间戳转换成日期
    getTime(date) {
        return new Date(parseInt(date)).toLocaleString();
    }

    //获取表格的数据源
    getDataSource(){
        const {issueList} = this.props;
        console.log('获取表格数据：',issueList);
        const data = [];
        if(issueList){
            for (let i = 0; i < issueList.length; i++) {
                var assign_name = issueList[i].assignee?issueList[i].assignee.name:null;
                var labels = issueList[i].labels?issueList[i].labels+';':null;
                data.push({
                    group_id:issueList[i].iid,
                    project_id:issueList[i].project_id,
                    id:issueList[i].id,
                    title: issueList[i].title,
                    description:issueList[i].description,
                    author_name: issueList[i].author.name,
                    assignee_name: assign_name,
                    created_at:  this.getTime(issueList[i].created_at),
                    due_date:this.getTime(issueList[i].due_date),
                    labels: labels,
                    state: issueList[i].state,
                });

                var isRepeated = false;
                for (var j = 0, len = authName.length; j < len; j++) {
                    if (issueList[i].author.name == authName[j].value) {
                        isRepeated = true;
                         break;
                        }
                    }
                if (!isRepeated) {
                    authName.push({text:issueList[i].author.name,
                        value:issueList[i].author.name});
                   }

            }

        }
        return data;
    }


    render() {
        const pagination = {
            pageSize:6,
        };

        return (
            <Box title="问题列表信息">
                <Button onClick={this.editIssue.bind(this,'add',null)}>新增问题</Button>
                <Table columns={this.issueListColumns(this)} dataSource={this.getDataSource()}
                       bordered
                       size="middle"
                       loading={this.props.loading}
                       pagination={pagination}
                       scroll={{y:300}}
                >
                </Table>
            </Box>

        )

    }

}


IssueList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


IssueList.prototype.issueListColumns = (self)=>[{
    title: '所属项目组',
    dataIndex: 'group_id',
    width: '8%',
},{
    title: '所属项目',
    dataIndex: 'project_id',
    width: '8%',
    //fixed: 'left'
},{
    title: '问题名称',
    dataIndex: 'title',
    width: '10%'
},{
    title: '问题描述',
    dataIndex: 'description',
    width: '10%'
}, {
    title: '创建人',
    dataIndex: 'author_name',
    width: '8%',
    filters:authName,
    onFilter: (value, record) => record.author_name.indexOf(value) === 0
},{
    title: '修复人',
    dataIndex: 'assignee_name',
    width: '8%',
},{
    title: '问题标签',
    dataIndex: 'labels',
    width: '10%',
    sorter: (a, b) => a.labels.length - b.labels.length
}, {
    title: '问题创建时间',
    dataIndex: 'created_at',
    width: '10%',
    sorter: (a, b) => a.created_at - b.created_at,
}, {
    title: '计划完成时间',
    dataIndex: 'due_date',
    width: '10%'
},{
    title: '状态',
    dataIndex: 'state',
    width: '7%'
},{
    title: '操作',
    dataIndex: 'key',
    width: '12%',
    render: (text, record, index)=> {
        return <Button type="ghost" onClick={self.issueNotes.bind(self, record)}>讨论历史</Button>;
    }
}];



function mapStateToProps(state) {
    return {
        issueList: state.issue.issueList,
        loading:state.issue.loading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(issue, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);