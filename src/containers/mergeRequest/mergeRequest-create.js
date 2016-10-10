/**
 * Created by zhaojp on 2016/10/8.
 */
import React,{ PropTypes, Component } from 'react';
import { Col, Button, Modal, Form, Input, Select,notification} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchMessageAction from './actions/fetch-datasource-action'

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class createMergeRequest extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchMessage.fetchDataSource(17);
    }

    handleCancel() {
        const {form} = this.props;
        const {router} = this.context;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                router.replace('/mergeRequest.html');
                form.resetFields();
            },
            onCancel() {
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const {getProjectInfo} = this.props;
        const projectId = getProjectInfo.gitlabProject.id;
        const {form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.project_id=projectId;
            }
        })

    }

    render(){
        const {editType} = this.props.location.state;
        const { getFieldProps } = this.props.form;

        const {getProjectInfo} = this.props;
        const projectId = getProjectInfo.gitlabProject.id;
        const path = getProjectInfo.gitlabProject.path_with_namespace;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const assignee =this.props.members?this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const mileStoneOptions =this.props.milestones?this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        return (
            <Box title={editType == 'add' ? '添加MR' : '修改MR'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                        <FormItem {...formItemLayout} label="source branch">
                                <Select style={{ width: 200 }} {...getFieldProps('path',{initialValue: path})} >
                                    <Option key={projectId}>{path}</Option>
                                </Select>
                                <Select style={{ width: 80,marginLeft:5 }} {...getFieldProps('source_branch',{initialValue: 'master'})} >
                                    <Option value="master">master</Option>
                                </Select>
                        </FormItem>

                        <FormItem {...formItemLayout}  label="target branch" >
                                <Select style={{ width: 200 }} {...getFieldProps('target_project_id',{initialValue: 'devops-web'})} >
                                    <Option value="devops-web">devops-web</Option>
                                </Select>
                                <Select style={{ width: 80,marginLeft:5 }} {...getFieldProps('target_branch',{initialValue: 'dev'})} >
                                    <Option value="dev">dev</Option>
                                </Select>
                        </FormItem>


                        <FormItem {...formItemLayout}  label="MR名称" >
                        <Input placeholder="title" {...getFieldProps('title',{rules:[{ required:true,message:'MR名称不能为空'}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="MR描述" >
                        <Input type="textarea" placeholder="description" rows="5" {...getFieldProps('description',{rules:[{required:true,message:'不能为空'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="指派给" >
                        <Select size="large"  style={{ width: 200 }} {...getFieldProps('assignee.id',{rules:[{required:true,message:'请选择指派的人'}]})} >
                            {assignee}
                        </Select>
                    </FormItem>
                    <FormItem {...formItemLayout} label="里程碑" >
                        <Select size="large"  style={{ width: 200 }} {...getFieldProps('milestone.id')} >
                            {mileStoneOptions}
                        </Select>
                        <br/>
                        <a href="mileStone.html">Create new mileStone</a>
                    </FormItem>

                    <FormItem {...formItemLayout} label="MR标签" >
                        <Select multiple size="large"  style={{ width: 200 }} {...getFieldProps('labels')} >
                            {label}
                        </Select>
                        <br/>
                        <a href="label.html">Create new label</a>
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

createMergeRequest.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        milestones:state.fetchMergeData.milestones,
        labels:state.fetchMergeData.labels,
        members : state.fetchMergeData.members,
        loginInfo:state.login.profile,
        getProjectInfo:state.getProjectInfo.projectInfo,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchMessage : bindActionCreators(fetchMessageAction,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(createMergeRequest));
