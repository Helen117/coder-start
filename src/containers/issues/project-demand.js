/**
 * Created by helen on 2016/12/5.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin} from 'antd';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as issue from './actions/issue-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class AddDemand extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    isEmptyObject(obj){
        for(var key in obj){
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    componentDidMount() {
        const {actions,project} = this.props;
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(!this.isEmptyObject(projectInfo)){
            actions.fetchDataSource(projectInfo.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        const result = nextProps.issue.addIssue;
        const error = nextProps.issue.addIssueError;

        if (!error && result) {
            message.success('新增成功');
            this.context.router.push({pathname: '/issueList'});
        }
    }

    shouldComponentUpdate(nextprops,nextState){
        return true;
    }

    getDueDate(id,dataList){
        for(let i=0; i<dataList.length;i++){
            if(id==dataList[i].id){
                return dataList[i].due_date;
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions,form ,loginInfo,project,milestones} = this.props;
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};

        form.validateFields((errors, values) => {
            if (!!errors) {
                //message.error(errors,2);
                return;
            } else {
                const data = form.getFieldsValue();
                data.username=loginInfo.username;
                // console.log('收到表单值：', data);
                if(data.milestone.id&&data.due_date){
                    const due_date = this.getDueDate(data.milestone.id,milestones);
                    // console.log(moment(new Date(parseInt(due_date)),'YYYY-MM-DD HH:mm:ss'));
                    if(data.due_date<=new Date(parseInt(due_date))){

                    }else{
                        message.error('问题计划完成时间不能大于里程碑时间:'+new Date(parseInt(due_date)).toLocaleDateString(),3);
                        return;
                    }
                }

                data.project_id = projectInfo.id;
                data.type='demand';
                actions.addIssues(data);
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
        return current && current.startOf('day') < moment().startOf('day')
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {project} = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const assignee =this.props.members?this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const mileStoneOptions =this.props.milestones?this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        if(projectInfo.id){
        return (
                <Box title='新增需求'>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout}  label="名称" >
                            {getFieldDecorator('title',{rules:[{ required:true,message:'问题名称不能为空'}]})(<Input placeholder="title"/>)}
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
                                         style={{ width: 300 }}>
                                    {mileStoneOptions}
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

                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">创建</Button>
                        </FormItem>
                    </Form>
                </Box>
        );
        }else {
            return(
                <div className="null_type_div">
                    <span><Icon type="exclamation-circle-o" />   请选择一个项目</span>
                </div>
            )
        }
    }
}

AddDemand.contextTypes = {
    router: PropTypes.object.isRequired
};

AddDemand = Form.create()(AddDemand);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        milestones:state.GetIssueDependent.milestones,
        labels:state.GetIssueDependent.labels,
        members : state.GetIssueDependent.members,
        fetchErrors:state.GetIssueDependent.fetchErrors,
        issue:state.issue,
        loginInfo:state.login.profile,
        project:state.project,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddDemand);