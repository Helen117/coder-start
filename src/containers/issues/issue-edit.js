/**
 * Created by helen on 2016/9/19.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin} from 'antd';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as issue from './actions/issue-action';
import * as home from '../home/actions/home-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class AddIssue extends Component{
    constructor(props){
        super(props);
        this.state = {delable:false};
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    componentDidMount() {
        const {actions,project} = this.props;
        const {selectedRow,editType} = this.props.location.state;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(selectedRow){
            actions.fetchDataSource(selectedRow.project_id);
            var milestoneId = selectedRow.milestone_id?selectedRow.milestone_id:0;
            actions.getIssueDemand(selectedRow.project_id,milestoneId);
        }else if(!this.isEmptyObject(projectInfo)){
            actions.fetchDataSource(projectInfo.id);
            actions.getIssueDemand(projectInfo.id,0);
        }

        // console.log('selectedRow:',selectedRow);
        if (selectedRow){
            const {setFieldsValue} = this.props.form;
            if(editType=='add'){
                setFieldsValue({'parent_id':selectedRow.id.toString()});
            }else{
                setFieldsValue(selectedRow);
            }
            setFieldsValue({'labels' : selectedRow.labels?selectedRow.labels.split(','):[]});
            //this.setState({assign:selectedRow.assignee_name,milestone:selectedRow.milestone_id});
            if(selectedRow.assignee_id){
                setFieldsValue({'assignee.id':selectedRow.assignee_id.toString()});
            }
            if(selectedRow.milestone_id){
                setFieldsValue({'milestone.id':selectedRow.milestone_id.toString()});
            }
            if(selectedRow.due_date){
                setFieldsValue({'due_date': moment(selectedRow.due_date,"YYYY-MM-DD")});//时间类型转换
            }

            if(selectedRow.author_id==this.props.loginInfo.userId){
                this.setState({delable:true});
            }

        }
    }

    componentWillReceiveProps(nextProps) {

        const result = nextProps.issue.addIssue;
        const error = nextProps.issue.addIssueError;
        const updateIssueError = nextProps.issue.updateIssueError;
        const updateIssue = nextProps.issue.updateIssue;
        const dataSourceErrors = nextProps.fetchErrors;
        const demandError = nextProps.errors;

        // if(dataSourceErrors && dataSourceErrors!= this.props.fetchErrors){
        //     this.errorMessage('获取数据失败!',dataSourceErrors);
        // }
        // if(demandError && demandError!= this.props.errors){
        //     this.errorMessage('获取需求信息失败!',demandError);
        // }
        //
        // if(error && error!= this.props.issue.addIssueError){
        //     // message.error('新增失败!'+error);
        //     this.errorMessage('新增失败!',error);
        // }
        if (!error && result) {
            message.success('新增成功');
            this.props.home.getNotifyItems(this.props.loginInfo.userId);
            this.context.router.goBack();
        }

        // if(updateIssueError && updateIssueError!= this.props.issue.updateIssueError){
        //     // message.error('操作失败!'+updateIssueError);
        //     this.errorMessage('操作失败!',updateIssueError);
        // }
        if (!updateIssueError && updateIssue) {
            message.success('操作成功');
            this.props.home.getNotifyItems(this.props.loginInfo.userId);
            this.context.router.goBack();
        }

        // if(nextProps.issue.delErrors && nextProps.issue.delErrors!= this.props.issue.delErrors){
        //     message.error('删除失败!'+nextProps.issue.delErrors);
        // }
        // if (!nextProps.issue.delErrors && nextProps.issue.delIssue) {
        //     message.success('删除成功');
        //     this.context.router.goBack();
        // }

    }

    shouldComponentUpdate(nextprops,nextState){
        // console.log('nextprops:',nextprops);
        // console.log('nextState:',nextState);
        return true;
    }

    // errorMessage(info,error){
    //     notification.error({
    //         message: info,
    //         description:error,
    //         duration:null,
    //     });
    // }

    getDueDate(id,dataList){
        for(let i=0; i<dataList.length;i++){
            if(id==dataList[i].id){
                return dataList[i].due_date;
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions,form ,loginInfo,project,milestones,demandList} = this.props;
        const {editType,selectedRow} = this.props.location.state;

        form.validateFields(['title','description','due_date','parent_id','assignee.id'],(errors, values) => {
            if (!!errors) {
                //message.error(errors,2);
                return;
            } else {
                const data = form.getFieldsValue();
                data.username=loginInfo.username;
                data.type='bug';
                // console.log('收到表单值：', data);
                if(data.milestone.id&&data.due_date){
                    const due_date = this.getDueDate(data.milestone.id,milestones);

                    if(new Date(due_date).toLocaleDateString()==new Date(data.due_date.format()).toLocaleDateString()||data.due_date<=new Date(due_date)){

                    }else{
                        message.error('问题计划完成时间不能大于里程碑时间:'+new Date(parseInt(due_date)).toLocaleDateString(),3);
                        return;
                    }
                }

                    const due_date = this.getDueDate(data.parent_id,demandList);
                    if(new Date(due_date).toLocaleDateString()==new Date(data.due_date.format()).toLocaleDateString()||data.due_date<=new Date(due_date)){

                    }else{
                        message.error('bug计划完成时间不能大于对应的需求时间:'+new Date(parseInt(due_date)).toLocaleDateString(),3);
                        return;
                    }

                if(editType=='add'){
                    data.project_id = projectInfo.id;
                    // data.created_at = Date.now();
                    actions.addIssues(data);
                }else{
                    form.validateFields(['reason'],(errors, values) => {
                        if (!!errors) {
                            //message.error(errors,2);
                            return;
                        } else {
                            if (data.title == selectedRow.title && data.description == selectedRow.description && new Date(parseInt(data.due_date.valueOf())).toLocaleDateString() == selectedRow.due_date
                                && data.assignee.id == selectedRow.assignee_id && data.milestone.id == selectedRow.milestone_id) {
                                message.info('数据没有变更，不需提交', 2);
                            } else {
                                data.author_id = loginInfo.userId;
                                // data.updated_at = Date.now();
                                data.project_id = selectedRow.project_id;
                                data.id = selectedRow.id;
                                data.state =  selectedRow.state;
                                actions.updateIssue(data);
                            }
                        }
                    })
                }

            }
        })
    }

    // checkDueDay(rule, value, callback) {
    //     // console.log(new Date(value) <= Date.now());
    //     if (value && value.valueOf() < Date.now()) {
    //         callback(new Error('时间不能小于现在!'));
    //     } else {
    //         callback();
    //     }
    // }

    disabledDate(current) {
        return current && current < moment();
    }

    handleCancel() {
        const {form} = this.props;
        const {router} = this.context;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                router.goBack();
                form.resetFields();
            },
            onCancel() {
            }
        })
    }

    loadIssues(value){

        const {selectedRow} = this.props.location.state;
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const projectId = projectInfo.id;
        console.log(value,selectedRow,projectId);
        if (value && projectId){
            this.props.actions.getIssueDemand(projectId,value);
        }else if(value && selectedRow){
            this.props.actions.getIssueDemand(selectedRow.project_id,value);
        }
    }

    handleOk() {
        const {selectedRow} = this.props.location.state;
        const {actions,form,loginInfo} = this.props;

        form.validateFields(['delete_reason'],(errors, values) => {
            if (!!errors) {
                return;
            } else {
                var data = {
                    state:selectedRow.state,
                    project_id : selectedRow.project_id,
                    id : selectedRow.id,
                    state_event : 'delete',
                    username : loginInfo.username,
                    reason : form.getFieldValue('delete_reason'),
                };
                actions.updateIssue(data);

                this.setState({
                    visible: false,
                });

                form.resetFields(['delete_reason']);
            }
        })
    }

    cancel(e) {
        this.setState({
            visible: false,
        });
    }


    deleteIssue(){
        this.setState({
            visible: true,
        });
    }

    render() {

        const {editType} = this.props.location.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };

        const pending = this.props.pending?true:false;

        const assignee =this.props.members?this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const mileStoneOptions =this.props.milestones?this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        const demands =this.props.demandList?this.props.demandList.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const delButton = this.state.delable?<Button type="primary" onClick={this.deleteIssue.bind(this)} loading={this.props.issue.delLoading}>删除</Button>:'';
        const modifyReason = editType=='modify'?<FormItem {...formItemLayout}  label="问题修改原因" >
            {getFieldDecorator('reason',{rules:[{ required:true,message:'修改原因不能为空'}]})(<Input type="textarea" rows="5" />)}
        </FormItem>:'';
        return (
            <Spin spinning={pending}>
            <Box title={editType == 'add' ? '新增问题' : '修改问题'}>
                 <Form horizontal onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout}  label="标题" >
                        {getFieldDecorator('title',{rules:[{ required:true,message:'不能为空'}]})(<Input placeholder="title"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述" >
                        {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="description" rows="5" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="里程碑" >
                        {getFieldDecorator('milestone.id')(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择里程碑"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     onSelect={this.loadIssues.bind(this)}
                                     style={{ width: 300 }}>
                            {mileStoneOptions}
                        </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="需求" >
                        {getFieldDecorator('parent_id',{rules:[{required:true,message:'不能为空'}]})(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择对应的需求"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     style={{ width: 300 }} >
                            {demands}
                        </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="问题标签" >
                        {getFieldDecorator('labels')(
                            <Select multiple
                                    style={{ width: 300 }} >
                            {label}
                        </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="计划完成时间" >
                        {getFieldDecorator('due_date',{rules: [{required: true, type: 'object', message: '请选择计划完成时间'}]})(<DatePicker disabledDate={this.disabledDate.bind(this)} style={{ width: 300 }}  />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="指派给" >
                        {getFieldDecorator('assignee.id',{rules:[{required:true,message:'不能为空'}]})(
                            <Select showSearch
                                    showArrow={false}
                                    placeholder="请选择人员"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    style={{ width: 300 }}>
                                {assignee}
                            </Select>)}
                    </FormItem>

                    {modifyReason}

                    <Modal title="您是否确定要删除此问题?" visible={this.state.visible}
                           onOk={this.handleOk.bind(this)} onCancel={this.cancel.bind(this)}
                    >
                        <p>如确定删除，请输入删除原因：</p>
                        <FormItem>
                            {getFieldDecorator('delete_reason',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="reason" rows="5"  />)}
                        </FormItem>
                    </Modal>

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                        {delButton}
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
            </Spin>
        );
    }
}

AddIssue.contextTypes = {
    router: PropTypes.object.isRequired
};

AddIssue.propTypes = {
    milestones: PropTypes.array,
    members: PropTypes.array,
    labels: PropTypes.array
};

AddIssue.defaultProps = {
    milestones: [],
    members: [],
    labels: []
};

AddIssue = Form.create()(AddIssue);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        milestones:state.GetIssueDependent.milestones,
        labels:state.GetIssueDependent.labels,
        members : state.GetIssueDependent.members,
        fetchErrors:state.GetIssueDependent.fetchErrors,
        issue:state.issue,
        loginInfo:state.login.profile,
        pending:state.GetIssueDemand.pending,
        demandList:state.GetIssueDemand.demands,
        errors:state.GetIssueDemand.errors,
        project:state.project,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch),
        home:bindActionCreators(home, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddIssue);