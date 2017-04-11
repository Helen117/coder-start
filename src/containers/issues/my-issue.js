/**
 * Created by helen on 2016/10/19.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,Select,DatePicker,Col,Row,Collapse,message,notification,Table,Input,Modal ,Upload,Icon,InputNumber,Spin } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';
import * as getAllUser from '../register/actions/register-action';
import * as home from '../home/actions/home-action';
import {fetchMergeBranchData} from '../mergeRequest/mergeRequest-action';
import IssueList from '../../components/issues-list';
import styles from './index.css';
import Box from '../../components/box';
import fetchData from '../../utils/fetch'
import EditTask from '../task-card/edit-task';
import {taskPassTest} from '../task-card/action';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;

class MyIssueList extends Component {

    constructor(props) {
        super(props);
        this.state ={visible: false,bugVisible:false, record:'',taskVisible: false,workTime:true};
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
            dataList.state='opened';
        }
        actions.getMyIssue(dataList);

    }

    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {
        const {actions,loginInfo,myIssueError} = this.props;
        const {mergeBranch,addResult,taskPass} = nextProps;
        if(nextProps.location.state && this.props.location.state!=nextProps.location.state){
            actions.getMyIssue(nextProps.location.state.data);
        }

        if(this.props.mergeBranch != mergeBranch && mergeBranch ){
            if( mergeBranch.length >1){
                this.context.router.push({
                    pathname: '/CreateMergeRequest',
                    state: {record:this.state.record, projectId: this.state.record.project_id}
                });
            }else{
                message.warning('请先fork项目后再提交代码');
            }
        }

        if(nextProps.closeBug&&nextProps.closeBug!=this.props.closeBug){
            this.refresh();
        }

        if(nextProps.revertBug&&nextProps.revertBug!=this.props.revertBug){
            this.refresh();
        }

        if(addResult&&addResult!=this.props.addResult&&!addResult.getLoading){
            this.refresh();
        }

        if(taskPass&&taskPass!=this.props.taskPass&&!taskPass.loading){
            this.refresh();
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

    refresh(){
        const {actions,loginInfo,home} = this.props;
        message.success('操作成功');
        var data ={
            state:'opened',
            assigned_id:loginInfo.userId,
        };
        home.getNotifyItems(loginInfo.userId);
        actions.getMyIssue(data);
    }

    handleReset(e) {
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,form,loginInfo} = this.props;
        const data = form.getFieldsValue();
        var dataList ={
            assigned_id:loginInfo.userId,
            title:data.title,
            author_id:data.author_name,
            state:data.state,
            type:data.type,
            start:data.created_at&&data.created_at.length>0?data.created_at[0].valueOf():'',
            end:data.created_at&&data.created_at.length>0?data.created_at[1].valueOf():'',
            due_start:data.due_date&&data.due_date.length>0?data.due_date[0].valueOf():'',
            due_end:data.due_date&&data.due_date.length>0?data.due_date[1].valueOf():'',
        };
        actions.getMyIssue(dataList);
    }

    editBug(selectedRow) {
        this.context.router.push({
            pathname: '/bug-edit',
            state: {selectedRow}
        });
    }

    modifyConfirm(record) {
        record.task_id ='';
        this.context.router.push({
            pathname: '/confirmList',
            state: {record}
        });
    }


    isPromiseMerge(result,record){
        if(result) {
            const {fetchMergeBranchData, loginInfo} = this.props;
            fetchMergeBranchData('', record.project_id, loginInfo.userId);
            this.setState({
                record: record
            })

        }else{
            notification.error({
                        message: '不能提交合并申请',
                        description:'该问题不在最近的上线点中，不能提交合并申请',
                        duration:10,
                    });
        }
    }

    mergeRequest(record){
        const path = '/project/validate-issue-mr'
        const params = {issue_id:record.id}
        fetchData(path, params,record,this.isPromiseMerge.bind(this))
    }

    closeBug(record) {
        const {actions,loginInfo} = this.props;
        var data = {
            devops_issues_key : record.devops_issues_key,
            demand_id:record.sets_issue_id,
            author_id:loginInfo.userId,
            state_event : 'close',
        };
        actions.updateIssue(data);
    }

    reopenBug(record){
        this.setState({
            bugVisible: true,
            record:record,
        });
    }

    testPass(record){
        console.log('record:',record.story_id);
        //task测试完成不需要填工时
        if(record.story_id){
            this.setState({
                workTime:false,
            });
        }

        this.setState({
            visible: true,
            record:record,
        });

    }

    revertBug(){
        const {actions,form,loginInfo} = this.props;
        form.validateFields(['reason'],(errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                actions.revertBug(this.state.record.id,loginInfo.name,data.reason);
                this.setState({
                    bugVisible: false,
                });

                form.resetFields();
            }
        })
    }

    cancelBug(e) {
        this.setState({
            bugVisible: false,
        });
        this.props.form.resetFields();
    }

    handleOk() {
        const {actions,form,loginInfo,taskPassTestAction} = this.props;
        form.setFieldsValue({'files':this.state.fileList});
        if(this.state.workTime) {
            form.validateFields(['design_work_time', 'files'], (errors, values) => {
                if (!!errors) {
                    return;
                } else {
                    const data = form.getFieldsValue();
                    // data.demand_id=this.state.record.sets_issue_id;
                    data.devops_issues_key = this.state.record.devops_issues_key;
                    actions.testPass(data);
                    this.setState({
                        visible: false,
                        fileList: '',
                    });

                    form.resetFields();
                }
            })
        }else{
            form.validateFields(['files'], (errors, values) => {
                if (!!errors) {
                    return;
                } else {
                    const data = form.getFieldsValue();
                    const taskInfo ={
                        operator_id:loginInfo.userId,
                        id:this.state.record.story_id,
                        test_report_files:this.state.fileList
                    };
console.log('taskInfo:',taskInfo);
                    taskPassTestAction(taskInfo);

                    this.setState({
                        visible: false,
                        fileList: '',
                        workTime:true,
                    });

                    form.resetFields();
                }
            })
        }
    }

    cancel(e) {
        this.setState({
            visible: false,
            fileList:'',
        });
        this.props.form.resetFields();
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
                if(list[i].state=='opened'){
                    list[i].status='打开';
                }else if(list[i].state=='closed'){
                    list[i].status='关闭';
                }

                if(list[i].labels&&list[i].labels.length>0){
                    list[i].label_names=[];
                    for(let j=0;j<list[i].labels.length;j++){
                        list[i].label_names.push(list[i].labels[j].name);
                    }
                }
                list[i].label = list[i].label_names && list[i].label_names.length > 0 ? list[i].label_names + '' : '';
                if(list[i].assignee_developer_or_tester){
                    if(list[i].project_id){
                        list[i].developer_or_tester = list[i].assignee_developer_or_tester.name+'(测试)';
                    }else{
                        list[i].developer_or_tester = list[i].assignee_developer_or_tester.name+'(开发)';
                    }
                }
            }
        }
        return list;
    }

    rowClassName(record,index) {
        if (record.state == 'opened') {
            if(record.type=='demand'){
                return styles.open;
            }else{
                return styles.bug;
            }
        }
        if (record.state == 'closed') {
            return styles.close;
        }
    }

    beforeUpload(file){
        var len = file.name.length;
        // if (!(file.type === 'application/vnd.ms-excel')) {
        if (!(file.name.substr(len-4,4).toLowerCase()=='.xls')) {
            message.error('上传的测试报告限制为excel2003版本的文件(IIMP暂时不支持EXCEL2007版本的文件)！',5);
            return false;
        }


        if(file.size/ 1024 / 1024 >10){
            message.error('文件大小不能超过10M',3);
            return false;
        }
        if(file.size==0){
            message.error('不能上传空文件',3);
            return false;
        }
        let reader = new FileReader();
        reader.onloadend = function () {
            this.setState({
                fileList:[{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: reader.result
                }]
            });
            // console.log(reader.result);
        }.bind(this);
        reader.readAsDataURL(file);
        this.props.form.setFieldsValue({'files':this.state.fileList});

        return false;
    }

    setModifyTask(flag,record,editType,e){

        if(e){
            e.stopPropagation();
        }

        this.setState({
            taskVisible:flag,
            editType:editType,
            taskData:'',
            storyId:record.story_id,
            type:'bug'
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const userInfo = this.props.user?this.props.user.map(data => <Option key={data.id}>{data.name}</Option>):[];
        let loading =this.props.updateIssueLoading?true:false;

        var workTime = this.state.workTime?<FormItem {...formItemLayout} label="工时" >
            {getFieldDecorator('design_work_time',{rules:[{required:true,type:"number",message:'请填写设计工时'}]})(<InputNumber min={1} max={100}/>)}
        </FormItem>:'';

        return (
            <Spin spinning={loading}>
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
                                        {getFieldDecorator('state')(<Select allowClear={true}>
                                            <Option value="opened">打开</Option>
                                            <Option value="closed">关闭</Option>
                                        </Select>)}
                                    </FormItem>

                                    <FormItem label="计划完成时间" {...formItemLayout}>
                                        {getFieldDecorator('due_date')(<RangePicker size="default" />)}
                                    </FormItem>
                                </Col>

                                <Col sm={6}>
                                    <FormItem label="类型" {...formItemLayout}>
                                        {getFieldDecorator('type')(<Select allowClear={true}>
                                            <Option value="demand">需求</Option>
                                            <Option value="bug">bug</Option>
                                        </Select>)}
                                    </FormItem>

                                    <FormItem label="创建人"{...formItemLayout}>
                                        {getFieldDecorator('author_name')(
                                            <Select showSearch
                                                    showArrow={false}
                                                    allowClear={true}
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
                            rowClassName={this.rowClassName}
                    >
                    </Table>
                    <Modal title="上传测试文档" visible={this.state.visible}
                           confirmLoading={this.props.updateIssueLoading}
                           onOk={this.handleOk.bind(this)} onCancel={this.cancel.bind(this)}
                    >
                        {workTime}

                        <FormItem {...formItemLayout}  label="文档上传" >
                            {getFieldDecorator('files',{rules:[{required:true,type:"array",message:'请上传文档'}]})(
                                <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>)}
                        </FormItem>
                    </Modal>

                    <Modal title="您是否确定要回退bug?" visible={this.state.bugVisible}
                           confirmLoading={this.props.revertBugLoading}
                           onOk={this.revertBug.bind(this)} onCancel={this.cancelBug.bind(this)}
                    >
                        <p>如确定，请输入回退原因：</p>
                        <FormItem>
                            {getFieldDecorator('reason',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="reason" rows="5"  />)}
                        </FormItem>
                    </Modal>

                    <EditTask  taskData={this.state.taskData}
                               editType={this.state.editType}
                               visible={this.state.taskVisible}
                               type={this.state.type}
                               story_id={this.state.storyId}
                               setModifyTask={this.setModifyTask.bind(this)}
                    />
                </Box>
            </div>
            </Spin>
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
        width: '8%',
    },{
        title: '问题类型',
        dataIndex: 'issueType',
        width: '6%',
    },{
        title: '问题名称',
        dataIndex: 'issue_name',
        width: '8%',
    },{
        title: '描述',
        dataIndex: 'description',
        width: '10%',
    },{
        title: '问题标签',
        dataIndex: 'label',
        width: '8%',
    }, {
        title: '创建人',
        dataIndex: 'author_name',
        width: '8%',
    }, {
        title: '开发/测试',
        dataIndex: 'developer_or_tester',
        width: '8%',
    }, {
        title: '问题创建时间',
        dataIndex: 'created_at',
        width: '8%',
    }, {
        title: '计划完成时间',
        dataIndex: 'due_date',
        width: '8%',
    },{
        title: '状态',
        dataIndex: 'status',
        width: '5%',
    },{
        title: '项目',
        dataIndex: 'project_name',
        width: '8%',
    },{
        title: '项目集',
        dataIndex: 'sets_name',
        width: '8%',
    }, {
        title: '操作',
        dataIndex: 'key',
        width: '10%',
        render: (text, record, index)=> {
            if(record.state.indexOf('open')!=-1){
                if(record.project_id){
                    if(record.story_id){
                        return <div>
                            <a onClick={self.mergeRequest.bind(self, record)}>申请合并代码</a>
                        </div>;
                    }else{
                        return <div>
                            <a onClick={self.mergeRequest.bind(self, record)}>申请合并代码</a>
                            <br/>
                            <a onClick={self.modifyConfirm.bind(self, record)}>修改设计内容</a>
                        </div>;
                    }

                }else{
                    if (record.type == 'bug') {
                        if(record.is_sets_Issue_finished) {
                            return <div>
                                <a onClick={self.closeBug.bind(self, record)}>关闭bug</a>
                                <br/>
                                <a onClick={self.reopenBug.bind(self, record)}>bug回退</a>
                            </div>;
                        }else{
                            return <div>
                                <a onClick={self.closeBug.bind(self, record)}>关闭bug</a>
                            </div>;
                        }
                    } else if(record.is_sets_Issue_finished){
                        return <div>
                            <a onClick={self.editBug.bind(self,record)}>开Bug</a>
                            <br/>
                            <a onClick={self.testPass.bind(self, record)}>测试完成确认</a>
                        </div>;
                    }else if(record.story_id){
                        return <div>
                            <a onClick={self.setModifyTask.bind(self,true,record,'add')}>开Bug</a>
                            <br/>
                            <a onClick={self.testPass.bind(self, record)}>测试完成确认</a>
                        </div>;
                    }
                }
            }
        }
    }];

MyIssueList = Form.create()(MyIssueList);

function mapStateToProps(state) {
    return {
        mergeBranch : state.mergeRequest.mergeBranch,
        issueList: state.issue.myIssueList,
        loading:state.issue.myIssueLoading,
        myIssueError:state.issue.myIssueError,
        closeBug:state.issue.updateIssue,
        updateIssueLoading:state.issue.updateIssueLoading,
        loginInfo:state.login.profile,
        user:state.register.users,
        revertBug:state.issue.revertBug,
        revertBugLoading:state.issue.revertBugPending,
        addResult:state.taskCard.result,
        taskPass:state.taskCard.taskPass,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(issue, dispatch),
        getUserAction : bindActionCreators(getAllUser, dispatch),
        home:bindActionCreators(home, dispatch),
        fetchMergeBranchData : bindActionCreators(fetchMergeBranchData,dispatch),
        taskPassTestAction : bindActionCreators(taskPassTest,dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyIssueList);