/**
 * Created by helen on 2016/10/19.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,Select,DatePicker,Col,Row,Collapse,message,notification,Table,Input  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';
import * as getAllUser from '../register/actions/register-action';
import IssueList from '../../components/issues-list';
import styles from './index.css';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;

class MyIssueList extends Component {

    constructor(props) {
        super(props);
        this.state ={};
    }

    componentWillMount() {
        const {actions,loginInfo,getUserAction} = this.props;
        const {data} = this.props.location.state?this.props.location.state:'';
        var dataList ={};
        getUserAction.getAllUser();
        if(data){
            dataList = data;
        }else{
            dataList.assigned_id=loginInfo.userId;
        }
        actions.getMyIssue(dataList);
    }

    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {
        // console.log('nextProps:',nextProps);
        const {actions,loginInfo,myIssueError} = this.props;
        if(nextProps.location.state && this.props.location.state!=nextProps.location.state){
            actions.getMyIssue(nextProps.location.state.data);
        }
        // const thisProId = projectInfo?projectInfo.id:'';
        // const nextProId = nextProps.projectInfo?nextProps.projectInfo.id:'';
        //点击不同项目，重新加载数据
        // if(thisProId != nextProId && nextProId!=''){
        //     var data ={
        //         project_id:nextProps.projectInfo.id,
        //         assigned_id:loginInfo.userId,
        //     };
        //     actions.getMyIssue(data);
        // }

        // if(myIssueError&&myIssueError!=this.props.myIssueError){
        //     // message.error('获取数据失败'+myIssueError,3);
        //     this.errorMessage('获取数据失败!',myIssueError);
        // }
    }

    // errorMessage(info,error){
    //     notification.error({
    //         message: info,
    //         description:error,
    //         duration:null,
    //     });
    // }

    handleReset(e) {
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,form,loginInfo} = this.props;
        const data = form.getFieldsValue();
        // console.log("查询条件：",data);
        var dataList ={
            assigned_id:loginInfo.userId,
            title:data.title,
            author_id:data.author_name,
            state:data.state,
            start:data.created_at&&data.created_at.length>0?data.created_at[0]:'',
            end:data.created_at&&data.created_at.length>0?data.created_at[1]:'',
            due_start:data.due_date&&data.due_date.length>0?data.due_date[0]:'',
            due_end:data.due_date&&data.due_date.length>0?data.due_date[1]:'',
        };
        actions.getMyIssue(dataList);
    }

    editIssue(type, selectedRow) {
        this.context.router.push({
            pathname: '/issueEdit',
            state: {editType: type, selectedRow}
        });
    }

    issueNotes(record) {
        record.title = record.issue_name;
        this.context.router.push({
            pathname: '/issueNotes',
            state: {record}
        });
    }

    dataSources(list){
        if(list&&list.length>0){
            for(var i=0;i<list.length;i++){
                if(typeof(list[i].due_date)=="number") {
                    list[i].due_date = new Date(parseInt(list[i].due_date)).toLocaleDateString();
                }
                if(typeof(list[i].created_at)=="number") {
                    list[i].created_at = new Date(parseInt(list[i].created_at)).toLocaleDateString();
                }
                if(list[i].type=='demand'){
                    list[i].issueType ='需求';
                }else if(list[i].type=='defect'){
                    list[i].issueType ='缺陷';
                }else{
                    list[i].issueType ='bug';
                }
            }
        }
        return list;
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const userInfo = this.props.user?this.props.user.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="查询条件" key="1">
                        <Form horizontal className={styles.ant_search_form} >
                            <Row gutter={16}>
                                <Col sm={9}>

                                    <FormItem label="问题名称" {...formItemLayout}>
                                        {getFieldDecorator('title')(<Input />)}
                                    </FormItem>

                                    <FormItem label="创建时间" {...formItemLayout}>
                                        {getFieldDecorator('created_at')(<RangePicker size="default" />)}
                                    </FormItem>
                                </Col>
                                <Col sm={9}>
                                    <FormItem label="状态" {...formItemLayout}>
                                        {getFieldDecorator('state')(<Select >
                                            <Option value="opened">打开</Option>
                                            <Option value="closed">关闭</Option>
                                            <Option value="reopened" >重开</Option>
                                        </Select>)}
                                    </FormItem>

                                    <FormItem label="计划完成时间" {...formItemLayout}>
                                        {getFieldDecorator('due_date')(<RangePicker size="default" />)}
                                    </FormItem>
                                </Col>

                                <Col sm={6}>
                                    <FormItem label="创建人"{...formItemLayout}>
                                        {getFieldDecorator('author_name')(
                                            <Select showSearch
                                                    showArrow={false}
                                                    placeholder="请选择创建人"
                                                    optionFilterProp="children"
                                                    notFoundContent="无法找到">
                                                {userInfo}
                                            </Select>)
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
                                    <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Panel>
                </Collapse>
                <Box title="我的问题列表信息" >
                    <Table  columns={this.issueListColumns(this)} dataSource={this.dataSources(this.props.issueList)}
                            bordered
                            loading={this.props.loading}
                    >
                    </Table>
                </Box>
            </div>
        )

    }

}

MyIssueList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

MyIssueList.prototype.issueListColumns = (self)=>[
    {
        title: '里程碑',
        dataIndex: 'milestone_name',
        width: '9%',
    },{
        title: '问题类型',
        dataIndex: 'issueType',
        width: '9%',
        className:'columnClass',
    },{
        title: '问题名称',
        dataIndex: 'issue_name',
        width: '9%',
        className:'columnClass',
    },{
        title: '问题标签',
        dataIndex: 'labels',
        width: '9%',
        className:'columnClass',
    }, {
        title: '创建人',
        dataIndex: 'author_name',
        width: '9%',
        className:'columnClass',
    },{
        title: '修复人',
        dataIndex: 'assignee_name',
        width: '9%',
        className:'columnClass',
    }, {
        title: '问题创建时间',
        dataIndex: 'created_at',
        width: '9%',
        className:'columnClass',
    }, {
        title: '计划完成时间',
        dataIndex: 'due_date',
        width: '9%',
        className:'columnClass',
    },{
        title: '状态',
        dataIndex: 'state',
        width: '9%',
        className:'columnClass',
    },{
        title: '项目',
        dataIndex: 'project_name',
        width: '9%',
    },{
        title: '项目集',
        dataIndex: 'sets_name',
        width: '9%',
    }, {
        title: '操作',
        dataIndex: 'key',
        width: '8%',
        render: (text, record, index)=> {
            let style={'display':'none'};
            if(record.project_id){
                style={'display':''}
            }
            return <div>
                <a style ={style} onClick={self.issueNotes.bind(self, record)}>讨论历史</a>
            </div>;
        }
    }];

MyIssueList = Form.create()(MyIssueList);

function mapStateToProps(state) {
    return {
        issueList: state.issue.myIssueList,
        loading:state.issue.myIssueLoading,
        myIssueError:state.issue.myIssueError,
        loginInfo:state.login.profile,
        user:state.register.users,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(issue, dispatch),
        getUserAction : bindActionCreators(getAllUser, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyIssueList);