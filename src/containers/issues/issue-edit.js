/**
 * Created by helen on 2016/9/19.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as issue from './actions/issue-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class AddIssue extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentWillMount(){
        const {actions,projectInfo} = this.props;
        if(projectInfo){
            actions.fetchDataSource(projectInfo.gitlabProject.id);
        }

    }
    componentDidMount() {

        const {selectedRow} = this.props.location.state;
        //console.log('selectedRow:',selectedRow);
        if (selectedRow){
            const {setFieldsValue} = this.props.form;
            //时间类型转换
            if(selectedRow.due_date){
                selectedRow.due_date = new Date(Date.parse(selectedRow.due_date));
            }
            //labels substr(0,selectedRow.labels.length-1)
            selectedRow.labels = selectedRow.labels?selectedRow.labels.split(','):[];

            setFieldsValue(selectedRow);
            //this.setState({assign:selectedRow.assignee_name,milestone:selectedRow.milestone_id});
            if(selectedRow.assign_id){
                setFieldsValue({'assignee.id':selectedRow.assign_id.toString()});
            }
           if(selectedRow.milestone_id){
               setFieldsValue({'milestone.id':selectedRow.milestone_id.toString()});
           }

        }

    }

    componentWillReceiveProps(nextProps) {

        const result = nextProps.issue.addIssue;
        const error = nextProps.issue.addIssueError;

        if(error && error!= this.props.issue.addIssueError){
            message.error('新增失败!'+error);
        }
        if (!error && result) {
            message.success('新增成功');
            this.context.router.replace('/project-mgr/issue');
        }

        if(nextProps.issue.updateIssueError && nextProps.issue.updateIssueError!= this.props.issue.updateIssueError){
            message.error('修改失败!'+nextProps.issue.updateIssueError);
        }
        if (!nextProps.issue.updateIssueError && nextProps.issue.updateIssue) {
            message.success('修改成功');
            this.context.router.replace('/project-mgr/issue');
        }

    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions,form ,loginInfo,projectInfo} = this.props;
        const {editType,selectedRow} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.username=loginInfo.username;
                //console.log('收到表单值：', data);
                if(editType=='add'){
                    data.project_id = projectInfo.gitlabProject.id;
                    data.created_at = Date.now();
                    actions.addIssues(data);
                }else{
                    if(data.title==selectedRow.title&&data.description==selectedRow.description&&data.due_date==selectedRow.due_date
                        &&data.assignee.id==selectedRow.assign_id&&data.milestone.id==selectedRow.milestone_id){
                        message.info('数据没有变更，不需提交',2);
                    }else{
                        data.updated_at = Date.now();
                        data.project_id = selectedRow.project_id;
                        data.id = selectedRow.id;
                        actions.updateIssue(data);
                    }

                }

            }
        })
    }

    checkDueDay(rule, value, callback) {
        if (value && value.getTime() <= Date.now()) {
            callback(new Error('时间得大于现在吧!'));
        } else {
            callback();
        }
    }

    handleCancel() {
        const {form} = this.props;
        const {router} = this.context;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                router.replace('/project-mgr/issue');
                form.resetFields();
            },
            onCancel() {
            }
        })
    }

    render() {

        const {editType} = this.props.location.state;
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const assignee =this.props.members?this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const mileStoneOptions =this.props.milestones?this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        return (
            <Box title={editType == 'add' ? '新增问题' : '修改问题'}>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout}  label="问题名称" >
                        <Input placeholder="title" {...getFieldProps('title',{rules:[{ required:true,message:'问题名称不能为空'}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="问题描述" >
                        <Input type="textarea" placeholder="description" rows="5" {...getFieldProps('description',{rules:[{required:true,message:'不能为空'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="计划完成时间" >
                        <DatePicker style={{ width: 200 }} {...getFieldProps('due_date',{rules:[{ required:true,type: 'date',message:'不能为空'},{validator:this.checkDueDay}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="指派给" >
                        <Select style={{ width: 200 }}  {...getFieldProps('assignee.id',{rules:[{required:true,message:'请选择指派的人'}]})} >
                            {assignee}
                        </Select>
                    </FormItem>
                    <FormItem {...formItemLayout} label="里程碑" >
                        <Select  style={{ width: 200 }} {...getFieldProps('milestone.id')} >
                            {mileStoneOptions}
                        </Select>
                        <br/>
                        <a href="/project-mgr/createMilestones">Create new mileStone</a>
                    </FormItem>

                    <FormItem {...formItemLayout} label="问题标签" >
                        <Select multiple style={{ width: 200 }} {...getFieldProps('labels')} >
                            {label}
                        </Select>
                        <br/>
                        <a href="label">Create new label</a>
                    </FormItem>

                    <FormItem {...formItemLayout}  label="上传" >
                        <Upload {...getFieldProps('attachment')}>
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
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
        milestones:state.issue.milestones,
        labels:state.issue.labels,
        members : state.issue.members,
        issue:state.issue,
        loginInfo:state.login.profile,
        projectInfo:state.getProjectInfo.projectInfo,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddIssue);