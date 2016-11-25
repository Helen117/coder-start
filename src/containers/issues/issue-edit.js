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
// import 'moment/locale/zh-cn';
// moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class AddIssue extends Component{
    constructor(props){
        super(props);
        this.state = {able:true,delable:false};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    // componentWillMount(){
    //     const {actions,projectInfo} = this.props;
    //     const {selectedRow} = this.props.location.state;
    //     console.log('selectedRow:',selectedRow.projecct_id);
    //     console.log('projectInfo:',selectedRow);
    //     if(projectInfo){
    //         actions.fetchDataSource(projectInfo.id);
    //         actions.getIssueDemand(projectInfo.id,0);
    //     }else if(selectedRow){
    //         actions.fetchDataSource(selectedRow.projecct_id);
    //         actions.getIssueDemand(selectedRow.project_id,0);
    //     }
    //
    // }
    componentDidMount() {
        const {actions,projectInfo} = this.props;
        const {selectedRow} = this.props.location.state;

        if(selectedRow){
            actions.fetchDataSource(selectedRow.project_id);
            actions.getIssueDemand(selectedRow.project_id,0);
        }else if(projectInfo){
            actions.fetchDataSource(projectInfo.id);
            actions.getIssueDemand(projectInfo.id,0);
        }

        // console.log('selectedRow:',selectedRow);
        if (selectedRow){
            const {setFieldsValue} = this.props.form;
            //时间类型转换
            //labels substr(0,selectedRow.labels.length-1)
            selectedRow.labels = selectedRow.labels?selectedRow.labels.split(','):[];

            setFieldsValue(selectedRow);
            //this.setState({assign:selectedRow.assignee_name,milestone:selectedRow.milestone_id});
            if(selectedRow.assignee_id){
                setFieldsValue({'assignee.id':selectedRow.assignee_id.toString()});
            }
            if(selectedRow.milestone_id){
                setFieldsValue({'milestone.id':selectedRow.milestone_id.toString()});
            }
            if(selectedRow.due_date){
                setFieldsValue({'due_date': moment(selectedRow.due_date,"YYYY-MM-DD")});
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
            this.context.router.goBack();
        }

        // if(updateIssueError && updateIssueError!= this.props.issue.updateIssueError){
        //     // message.error('操作失败!'+updateIssueError);
        //     this.errorMessage('操作失败!',updateIssueError);
        // }
        if (!updateIssueError && updateIssue) {
            message.success('操作成功');
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

    // errorMessage(info,error){
    //     notification.error({
    //         message: info,
    //         description:error,
    //         duration:null,
    //     });
    // }

    getMilestoneDueDate(id){
        const {milestones} = this.props;
        for(let i=0; i<milestones.length;i++){
            if(id==milestones[i].id){
                return milestones[i].due_date;
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions,form ,loginInfo,projectInfo} = this.props;
        const {editType,selectedRow} = this.props.location.state;

        form.validateFields(['title','description','type','due_date'],(errors, values) => {
            if (!!errors) {
                //message.error(errors,2);
                return;
            } else {
                const data = form.getFieldsValue();
                data.username=loginInfo.username;
                // console.log('收到表单值：', data);
                if(data.milestone.id&&data.due_date){
                    const due_date = this.getMilestoneDueDate(data.milestone.id);
                    if(data.due_date<=new Date(parseInt(due_date))){

                    }else{
                        message.error('问题计划完成时间不能大于里程碑时间:'+new Date(parseInt(due_date)).toLocaleDateString(),3);
                        return;
                    }
                }
                if(data.type!='demand'&&!data.parent_id){
                    message.error('请选择对应的需求！',2);
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
                                && data.assignee.id == selectedRow.assign_id && data.milestone.id == selectedRow.milestone_id) {
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

    handleChange(value){
        if(value && value!='demand'){
            this.setState({able:false});
        }else{
            this.setState({able:true});
        }
    }

    loadIssues(value){
        const {selectedRow} = this.props.location.state;
        const projectId = this.props.projectInfo.id;

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

        //console.log(this.props.demandList);

        const demands =this.props.demandList?this.props.demandList.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const delButton = this.state.delable?<Button type="primary" onClick={this.deleteIssue.bind(this)} loading={this.props.issue.delLoading}>删除</Button>:'';
        const modifyReason = editType=='modify'?<FormItem {...formItemLayout}  label="问题修改原因" >
            {getFieldDecorator('reason',{rules:[{ required:true,message:'修改原因不能为空'}]})(<Input type="textarea" rows="5" />)}
        </FormItem>:'';
        return (
            <Spin spinning={pending}>
            <Box title={editType == 'add' ? '新增问题' : '修改问题'}>
                 <Form horizontal onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout}  label="问题名称" >
                        {getFieldDecorator('title',{rules:[{ required:true,message:'问题名称不能为空'}]})(<Input placeholder="title"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="问题描述" >
                        {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="description" rows="5" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="问题类型" >
                        {getFieldDecorator('type',{rules:[{required:true,message:'请选择问题类型'}]})(
                            <Select id="type"  style={{ width: 300 }} onSelect={this.handleChange.bind(this)}>
                                <Option value="demand">需求</Option>
                                <Option value="defect">缺陷</Option>
                                <Option value="bug" >Bug</Option>
                             </Select>)
                        }
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
                        <br/>
                        <a href="/project-mgr/createMilestones">Create new mileStone</a>
                    </FormItem>

                    <FormItem {...formItemLayout} label="需求" >
                        {getFieldDecorator('parent_id')(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择对应的需求"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     disabled={this.state.able}
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
                        <br/>
                        <a href="label">Create new label</a>
                    </FormItem>

                    <FormItem {...formItemLayout} label="计划完成时间" >
                        {getFieldDecorator('due_date',{rules: [{required: true, type: 'object', message: '请选择计划完成时间'}]})(<DatePicker disabledDate={this.disabledDate.bind(this)} style={{ width: 300 }}  />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="指派给" >
                        {getFieldDecorator('assignee.id')(
                            <Select showSearch
                                    showArrow={false}
                                    placeholder="请选择人员"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    style={{ width: 300 }}>
                                {assignee}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout}  label="上传" >
                        {getFieldDecorator('attachment')(
                            <Upload >
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>)}
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
        projectInfo:state.getProjectInfo.projectInfo,
        pending:state.GetIssueDemand.pending,
        demandList:state.GetIssueDemand.demands,
        errors:state.GetIssueDemand.errors,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddIssue);