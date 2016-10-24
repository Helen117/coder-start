/**
 * Created by helen on 2016/10/18.
 */
/**
 * Created by helen on 15016/9/19.
 */
import React, {PropTypes,Component} from 'react';
import { Table ,Button,Input,notification } from 'antd';
import './index.less';
import Box from '../box';

const authName =[];
const assigneeName =[];
const label = [];
const milestone =[];
export default class IssueList extends Component {

    constructor(props) {
        super(props);
    }

    editIssue(type, selectedRow) {
        //console.log('window.location:',window.location);
        //查看我的问题不选择项目时不能新增问题
        if(this.props.state=='myIssue' && !this.props.projectInfo){
            notification.error({
                message: '未选择项目',
                description:'请先在“代码管理“中选择一个项目！',
                duration: 2
            });
        }else{
            this.context.router.push({
                pathname: '/issueEdit',
                state: {editType: type, selectedRow}
            });
        }

    }

    issueNotes(record) {
        //this.context.router.replace('/issueNotes');
        //console.log('record:',record);
        this.context.router.push({
            pathname: '/issueNotes',
            state: {record}
        });
    }


    //时间戳转换成日期
    getTime(date) {
        if(date){
            return new Date(parseInt(date)).toLocaleDateString();
        }else{
            return null;
        }

    }

    //获取表格的数据源
    getDataSource(issueList){
        //console.log('issueList:',issueList);
        const data = [];
        if(issueList){
            for (let i = 0; i < issueList.length; i++) {
                var assign_name = issueList[i].assignee?issueList[i].assignee.name:null;
                var assign_id = issueList[i].assignee?issueList[i].assignee.id:null;
                var labels = issueList[i].labels&&issueList[i].labels.length>0?issueList[i].labels+'':null;
                var milestoneTitle = issueList[i].milestone?issueList[i].milestone.title:null;
                var milestone_id = issueList[i].milestone?issueList[i].milestone.id:null;
                var milestoneDueDate = issueList[i].milestone?issueList[i].milestone.due_date:null;
                data.push({
                    //group_name:groupInfo.name,
                    project_id:issueList[i].project_id,
                    //project_name:projectInfo.name,
                    id:issueList[i].id,
                    title: issueList[i].title,
                    description:issueList[i].description,
                    author_name: issueList[i].author?issueList[i].author.name:null,
                    author_username: issueList[i].author?issueList[i].author.username:null,
                    assignee_name: assign_name,
                    assign_id :assign_id,
                    milestoneTitle:milestoneTitle,
                    milestone_id:milestone_id,
                    milestoneDueDate:milestoneDueDate,
                    created_at:  this.getTime(issueList[i].created_at),
                    due_date:this.getTime(issueList[i].due_date),
                    labels: labels,
                    state: issueList[i].state,
                    login_username: this.props.loginInfo.username,
                });

                //过滤创建人
                var isRepeated = false;
                for (var j = 0, len = authName.length; j < len; j++) {
                    if (issueList[i].author&&issueList[i].author.name == authName[j].value) {
                        isRepeated = true;
                        break;
                    }
                }
                if (!isRepeated&&issueList[i].author) {
                    authName.push({text:issueList[i].author.name,
                        value:issueList[i].author.name});
                }

                //过滤修复人
                var flag = false;
                for (var n = 0; n<assigneeName.length; n++) {
                    if (assign_name && assign_name == assigneeName[n].value) {
                        flag = true;
                        break;
                    }
                }
                if (!flag&&assign_name) {
                    assigneeName.push({text:assign_name,
                        value:assign_name});
                }

                //过滤问题标签
                if(issueList[i].labels.length>0){
                    var isLabel = false;
                    for(var l=0;l<issueList[i].labels.length;l++){
                        for (var m = 0; m<label.length; m++) {
                            if ( issueList[i].labels[l] == label[m].value) {
                                isLabel = true;
                                break;
                            }
                        }
                        if (!isLabel) {
                            label.push({text:issueList[i].labels[l],
                                value:issueList[i].labels[l]});
                        }
                    }

                }

                //过滤里程碑
                var isflag = false;
                for (var s = 0; s<milestone.length; s++) {
                    if (milestoneTitle && milestoneTitle == milestone[s].value) {
                        isflag = true;
                        break;
                    }
                }
                if (!isflag&&milestoneTitle) {
                    milestone.push({text:milestoneTitle,
                        value:milestoneTitle});
                }


            }

        }
        return data;
    }

    rowClassName(record, index) {
        if (record.state == 'opened') {
            return 'open';
        }
        if (record.state == 'closed') {
            return 'close';
        }
        if (record.state == 'reopened') {
            return 'reopen';
        }
    }


    render() {
        const pagination = {
            pageSize:20,
        };

        return (
            <Box title="问题列表信息" >
                <Button type="primary" onClick={this.editIssue.bind(this,'add',null)}>新增问题</Button>
                <Table columns={this.issueListColumns(this)} dataSource={this.getDataSource(this.props.dataSource)}
                       bordered
                       size="middle"
                       loading={this.props.loading}
                       pagination={pagination}
                       rowClassName={this.rowClassName}
                    //onRowClick ={this.editIssue.bind(this,'modify')}
                    //scroll={{y:300}}
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


IssueList.prototype.issueListColumns = (self)=>[
//     {
//     title: '所属项目组',
//     dataIndex: 'group_name',
//     width: '8%',
//     render(value, row, index) {
//         const obj = {
//             children: value,
//             props: {},
//         };
//         if (index === 0) {
//             obj.props.rowSpan = 20;
//         }
//         if (index > 0) {
//             obj.props.rowSpan = 0;
//         }
//         return obj;
//     }
// },
    {
    title: '所属项目',
    dataIndex: 'project_id',
    width: '8%',
    render(value, row, index) {
        const obj = {
            children: value,
            props: {},
        };
        if (index === 0) {
            obj.props.rowSpan = 20;
        }
        if (index > 0) {
            obj.props.rowSpan = 0;
        }
        return obj;
    }
    //fixed: 'left'
},{
    title: '里程碑',
    dataIndex: 'milestoneTitle',
    width: '8%',
    filters:milestone,
    onFilter: (value, record) => record.milestoneTitle && record.milestoneTitle.indexOf(value) === 0,
    sorter: (a, b) => a.milestoneDueDate > b.milestoneDueDate
},{
    title: '问题标签',
    dataIndex: 'labels',
    width: '8%',
    filters:label,
    onFilter: (value, record) => record.labels && record.labels.indexOf(value) != -1,
    sorter: (a, b) => a.labels&&b.labels&&(a.labels.length - b.labels.length)
},{
    title: '问题名称',
    dataIndex: 'title',
    width: '8%'
},{
    title: '问题描述',
    dataIndex: 'description',
    width: '8%'
}, {
    title: '创建人',
    dataIndex: 'author_name',
    width: '7%',
    filters:authName,
    onFilter: (value, record) => record.author_name.indexOf(value) === 0
},{
    title: '修复人',
    dataIndex: 'assignee_name',
    width: '7%',
    filters:assigneeName,
    onFilter: (value, record) => record.assignee_name && record.assignee_name.indexOf(value) === 0
}, {
    title: '问题创建时间',
    dataIndex: 'created_at',
    width: '9%',
}, {
    title: '计划完成时间',
    dataIndex: 'due_date',
    width: '9%'
},{
    title: '状态',
    dataIndex: 'state',
    width: '8%',
    filters: [{
        text: 'closed',
        value: 'closed',
    }, {
        text: 'opened',
        value: 'opened',
    },{
        text: 'reopened',
        value: 'reopened',
    }],
    onFilter: (value, record) => record.state.indexOf(value) === 0,
    sorter: (a, b) => a.state - b.state
},{
    title: '操作',
    dataIndex: 'key',
    width: '13%',
    render: (text, record, index)=> {
        let style={'display':''};
        if(record.author_username!= record.login_username){
            style={'display':'none'}
        }
        return <div>
            <a style ={style} onClick={self.editIssue.bind(self,'modify', record)}>修改</a><br/>
            <a onClick={self.issueNotes.bind(self, record)}>讨论历史</a>
        </div>;
    }
}];

