/**
 * Created by helen on 2016/10/18.
 */
import React, {PropTypes,Component} from 'react';
import { Table ,Button,Input,notification } from 'antd';
import './index.less';
import Box from '../box';

export default class IssueList extends Component {

    constructor(props) {
        super(props);
    }

    substrKey(str){
        return str.substr(0,str.length-2)
    }

    getListNode(record,list) {
        for (var i = 0; i < list.length; i++) {//项目集
            for (var j = 0; j < list[i].children.length; j++) {//项目
                for (var k = 0; k < list[i].children[j].children.length; k++) {//里程碑
                    for (var n = 0; n < list[i].children[j].children[k].children.length; n++) {//需求
                        if (record.type == 'demand') {
                            if (record.key == list[i].children[j].children[k].children[n].key) {
                                record.id = this.substrKey(record.key);
                                var milestoneId = this.substrKey(list[i].children[j].children[k].key);
                                if(milestoneId!=0){
                                    record.milestone_id = milestoneId;
                                }
                                record.project_id = this.substrKey(list[i].children[j].key);
                                return record;
                            }
                        }
                        else {
                            for (var m = 0; m < list[i].children[j].children[k].children[n].children.length; m++) {//bug
                                if (record.key == list[i].children[j].children[k].children[n].children[m].key) {
                                    record.id = this.substrKey(record.key);
                                    record.parent_id = this.substrKey(list[i].children[j].children[k].children[n].key);
                                    var milestone = this.substrKey(list[i].children[j].children[k].key);
                                    if(milestone!=0){
                                        record.milestone_id = milestone;
                                    }
                                    record.project_id = this.substrKey(list[i].children[j].key);
                                    return record;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    editIssue(type, selectedRow){
        if(selectedRow){
            selectedRow = this.getListNode(selectedRow,this.props.dataSource);
            selectedRow.title = selectedRow.issue_name;
        }
        this.context.router.push({
            pathname: '/issueEdit',
            state: {editType: type, selectedRow}
        });
    }

    issueNotes(records) {
        //this.context.router.replace('/issueNotes');
        //console.log('record:',record);
        let record = this.getListNode(records,this.props.dataSource);
        record.title = record.issue_name;
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
    getDataSource(list){
        // console.log('issueList:',list);
        if(list) {
            for (var i = 0; i < list.length; i++) {//项目集
                for (var j = 0; j < list[i].children.length; j++) {//项目
                    for (var k = 0; k < list[i].children[j].children.length; k++) {//里程碑
                        for (var n = 0; n < list[i].children[j].children[k].children.length; n++) {//需求
                            if(typeof(list[i].children[j].children[k].children[n].due_date)=="number") {
                                list[i].children[j].children[k].children[n].due_date = this.getTime(list[i].children[j].children[k].children[n].due_date);
                            }
                            if(typeof(list[i].children[j].children[k].children[n].created_at)=="number")  {
                                list[i].children[j].children[k].children[n].created_at = this.getTime(list[i].children[j].children[k].children[n].created_at);
                            }
                            list[i].children[j].children[k].children[n].labels = list[i].children[j].children[k].children[n].labels && list[i].children[j].children[k].children[n].labels.length > 0 ? list[i].children[j].children[k].children[n].labels + '' : null;
                            if(list[i].children[j].children[k].children[n].type=='demand'){
                                list[i].children[j].children[k].children[n].issueType = "需求";
                            }

                            for (var m = 0; m < list[i].children[j].children[k].children[n].children.length; m++) {//bug
                                if(typeof(list[i].children[j].children[k].children[n].children[m].due_date)=="number") {
                                    list[i].children[j].children[k].children[n].children[m].due_date = this.getTime(list[i].children[j].children[k].children[n].children[m].due_date);
                                }
                                if(typeof(list[i].children[j].children[k].children[n].children[m].created_at)=="number"){
                                    list[i].children[j].children[k].children[n].children[m].created_at = this.getTime(list[i].children[j].children[k].children[n].children[m].created_at);
                                }
                                list[i].children[j].children[k].children[n].children[m].labels = list[i].children[j].children[k].children[n].children[m].labels && list[i].children[j].children[k].children[n].children[m].labels.length > 0 ? list[i].children[j].children[k].children[n].children[m].labels + '' : null;
                                if(list[i].children[j].children[k].children[n].children[m].type=='defect'){
                                    list[i].children[j].children[k].children[n].children[m].issueType = "缺陷";
                                }else{
                                    list[i].children[j].children[k].children[n].children[m].issueType = "Bug";
                                }
                            }
                        }
                    }
                }
            }
        }
        return list;
    }

    getdefaultExpandedRowKeys(list){
        const defaultExpandedRowKeys=[];
        if(list) {
            for (var i = 0; i < list.length; i++) {//项目集
                defaultExpandedRowKeys.push(list[i].key);
                for (var j = 0; j < list[i].children.length; j++) {//项目
                    defaultExpandedRowKeys.push(list[i].children[j].key);
                    if(this.props.issueType=='project'){

                    }else{
                        for (var k = 0; k < list[i].children[j].children.length; k++) {//里程碑
                            defaultExpandedRowKeys.push(list[i].children[j].children[k].key);
                        }
                    }
                }
            }
        }
        // console.log('defaultExpandedRowKeys:',defaultExpandedRowKeys);
        return defaultExpandedRowKeys;
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
            pageSize:2,
        };

        // const data = ["31_s","223_p","277_m","278_m","285_m"];

        return (
                <Table columns={this.issueListColumns(this)} dataSource={this.getDataSource(this.props.dataSource)}
                       bordered
                       size="middle"
                       loading={this.props.loading}
                       pagination={pagination}
                       rowClassName={this.rowClassName}
                       defaultExpandedRowKeys = {this.getdefaultExpandedRowKeys(this.props.dataSource)}
                    //onRowClick ={this.editIssue.bind(this,'modify')}
                    //scroll={{y:300}}
                >
                </Table>

        )

    }

}


IssueList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


const renderContent = function (value, row, index) {
        const obj = {
            children: value,
            props: {},
        };
        if (value) {
            obj.props.colSpan = 1;
        } else if (row.sets_name || row.project_name || row.milestone_name) {
            obj.props.colSpan = 0;
        }
        return obj;
};

IssueList.prototype.issueListColumns = (self)=>[
    {
    title: '项目集',
    dataIndex: 'sets_name',
    width: '15%',
    render(value, row, index) {
        const obj = {
            children: value,
            props: {},
        };
        if (value) {
            obj.props.colSpan = 12;
        }
        return obj;
    }
},
    {
    title: '项目',
    dataIndex: 'project_name',
    width: '5%',
    render(value, row, index) {
        const obj = {
            children: value,
            props: {},
        };
        if (value) {
            obj.props.colSpan = 11;
        }else if (row.sets_name){
            obj.props.colSpan = 0;
        }
        return obj;
    }
    // render(value, row, index) {
    //     const obj = {
    //         children: value,
    //         props: {},
    //     };
    //     if (index === 0) {
    //         obj.props.rowSpan = 20;
    //     }
    //     if (index > 0) {
    //         obj.props.rowSpan = 0;
    //     }
    //     return obj;
    // }
    //fixed: 'left'
},{
    title: '里程碑',
    dataIndex: 'milestone_name',
    width: '5%',
        render(value, row, index) {
            const obj = {
                children: value,
                props: {},
            };
            if (value) {
                obj.props.colSpan = 10;
            }else if (row.sets_name||row.project_name){
                obj.props.colSpan = 0;
            }
            return obj;
        }
},{
    title: '问题类型',
    dataIndex: 'issueType',
    width: '7%',
    className:'columnClass',
    render:renderContent,
},{
    title: '问题名称',
    dataIndex: 'issue_name',
    width: '7%',
    className:'columnClass',
    render:renderContent,
},{
    title: '问题描述',
    dataIndex: 'description',
    width: '7%',
    className:'columnClass',
    render:renderContent,
},{
    title: '问题标签',
    dataIndex: 'labels',
    width: '7%',
    className:'columnClass',
    render:renderContent,
}, {
    title: '创建人',
    dataIndex: 'author_name',
    width: '7%',
    className:'columnClass',
    render:renderContent,
},{
    title: '修复人',
    dataIndex: 'assignee_name',
    width: '7%',
    className:'columnClass',
    render:renderContent,
}, {
    title: '问题创建时间',
    dataIndex: 'created_at',
    width: '9%',
    className:'columnClass',
    render:renderContent,
}, {
    title: '计划完成时间',
    dataIndex: 'due_date',
    width: '9%',
    className:'columnClass',
    render:renderContent,
},{
    title: '状态',
    dataIndex: 'state',
    width: '7%',
    className:'columnClass',
    render:renderContent,
}
// ,{
//     title: '操作',
//     dataIndex: 'key',
//     width: '8%',
//     render: (text, record, index)=> {
//         const obj = {
//             children: text,
//             props: {},
//         };
//         let style={'display':'none'};
//         let modifyStyle={'display':'none'};
//         // console.log('self:',self);
//
//         if (record.sets_name||record.project_name||record.milestone_name){
//             obj.props.colSpan = 0;
//             return obj;
//         }
//
//         if(record.type!='demand'){
//             if(record.key.indexOf('i')!=-1) {
//                 style = {'display': ''};
//             }
//             if(record.key.indexOf('i')!=-1&&record.author_id==self.props.loginInfo.userId){
//                 modifyStyle={'display':''}
//             }
//             return <div>
//                 <a style ={modifyStyle} onClick={self.editIssue.bind(self,'modify', record)}>修改</a><br/>
//                 <a style ={style} onClick={self.issueNotes.bind(self, record)}>讨论历史</a>
//             </div>;
//         }else{
//             return <div>
//                 <a onClick={self.editIssue.bind(self,'add', record)}>新增问题</a><br/>
//             </div>;
//         }
//
//     }
// }
];

