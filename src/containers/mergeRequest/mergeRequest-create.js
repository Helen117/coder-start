/**
 * Created by zhaojp on 2016/10/8.
 */
import React,{ PropTypes, Component } from 'react';
import { Col, Button, Modal, Form, Input, Select,notification} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchMessageAction from './actions/fetch-datasource-action';
import createMr from './actions/mergeRequest-create-action';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class createMergeRequest extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchMessage.fetchSourceProData(this.props.getProjectInfo.gitlabProject.id);
        this.props.fetchMessage.fetchTargetProData(this.props.getProjectInfo.gitlabProject.id);
    }

    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '',
            duration: 1
        });
        this.context.router.goBack();
    }

    errCallback(){
        let errMessage =this.props.errMessage;
        notification.error({
            message: '创建失败',
            description:{errMessage},
            duration: 1
        });
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage } = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback();
        }
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

    handleSubmit(e) {
        e.preventDefault();
        const {getProjectInfo,targetProData,loginInfo} = this.props;
        const author = {};
        author.username= loginInfo.username;
        const {form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.project_id=getProjectInfo.gitlabProject.id;
                data.target_project_id = targetProData.id;
                data.author = author;
                this.props.createMr(data);
            }
        })

    }

    render(){
        const {editType} = this.props.location.state;
        const { getFieldProps } = this.props.form;
        const {getProjectInfo,targetProData} = this.props;

        const projectId = getProjectInfo? getProjectInfo.gitlabProject.id:null;
        const sourcePath = getProjectInfo? getProjectInfo.gitlabProject.path_with_namespace:null
        const assignee =this.props.members? this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const mileStoneOptions =this.props.milestones? this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];
        const targetBranch =targetProData? targetProData.branch.map(data => <Option key={data}>{data}</Option>):[];
        const targetPath = targetProData? targetProData.path_with_namespace:null;
        const initialTargetBranch = targetProData? targetProData.branch:null;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <Box title={editType == 'add' ? '添加MR' : '修改MR'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                    <FormItem {...formItemLayout} label="source branch">
                            <Select style={{ width: 200 }} {...getFieldProps('path',{initialValue: sourcePath})} >
                                <Option key={projectId}>{sourcePath}</Option>
                            </Select>
                            <Select style={{ width: 80,marginLeft:5 }} {...getFieldProps('source_branch',{initialValue: 'master'})} >
                                <Option value="master">master</Option>
                            </Select>
                    </FormItem>

                    <FormItem {...formItemLayout}  label="target branch" >
                            <Select style={{ width: 200 }} {...getFieldProps('target_project_path',{initialValue: targetPath})} >
                                <Option value={targetPath}>{targetPath}</Option>
                            </Select>
                            <Select style={{ width: 80,marginLeft:5 }} {...getFieldProps('target_branch',{initialValue: 'master'})} >
                                {targetBranch}
                            </Select>
                    </FormItem>


                    <FormItem {...formItemLayout}  label="MR名称" >
                        <Input placeholder="请输入MR名称" {...getFieldProps('title',{rules:[{ required:true,message:'请填写MR名称'}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="MR描述" >
                        <Input type="请输入MR描述" placeholder="description" rows="5" {...getFieldProps('description',{rules:[{required:true,message:'请填写MR描述'}]})} />
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
                        <Button type="primary" htmlType="submit" loading={this.props.loading} disabled={this.props.disabled}>确定</Button>
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
        targetProData : state.fetchTargetProject.targetProData,
        loginInfo:state.login.profile,
        getProjectInfo:state.getProjectInfo.projectInfo,
        loading:state.createMr.loading,
        disabled:state.createMr.disabled,
        inserted: state.createMr.result,
        errMessage:state.createMr.errors,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchMessage : bindActionCreators(fetchMessageAction,dispatch),
        createMr: bindActionCreators(createMr,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(createMergeRequest));
