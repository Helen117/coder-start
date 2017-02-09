/**
 * Created by zhaojp on 2016/10/8.
 */
import React,{ PropTypes, Component } from 'react';
import { Col, Row, Button, Modal, Form, Input, Select,notification,Cascader,message,Upload,Icon } from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchMrListData,createMr,fetchMergeAssign} from './mergeRequest-action'

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class CreateMergeRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const {projectId} = this.props.location.state;
        if(projectId){
            this.props.fetchMergeAssign(projectId);
        }
    }

    componentDidMount() {
        const {record} = this.props.location.state;
        const {setFieldsValue} = this.props.form;
        if(record){
            setFieldsValue({'issue_id':record.issue_name});
        }
    }

    componentWillReceiveProps(nextProps) {
        const { inserted} = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback("创建成功");
        }
    }

    shouldComponentUpdate(nextProps){
        let isRender = false;
        const mergeBranch = nextProps.mergeBranch;
        if(mergeBranch && mergeBranch.length>1){
            isRender = true;
        }
        return isRender;
    }

    insertCallback(type){
        message.success(type);
        this.props.fetchMrListData(this.props.mergeBranch[1].id,1,'opened');
        this.context.router.goBack();
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
                //do nothing
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const {mergeBranch,loginInfo} = this.props;
        const author = {};
        author.username= loginInfo.username;
        author.userId= loginInfo.userId;
        const {form} = this.props;
        const {record} = this.props.location.state;
        form.setFieldsValue({'developer_test_file':this.state.fileList});
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.project_id=this.mapSourceProject(mergeBranch,data.path);
                data.target_project_id = mergeBranch[0].id;
                data.author = author;
                data.issue_id = record?record.id:data.issue_id;
                // console.log('接收数据:',data);
                this.props.createMr(data);
            }
        })
    }

    mapSourceProject(mergeBranch,path){
        for(let i=1; i<mergeBranch.length; i++){
            if(mergeBranch[i].path_with_namespace==path){
                return mergeBranch[i].id;
            }
        }
    }

    mapSelectOption(branches){
        const branchOprion = [];
        for(let i=0; i<branches.length; i++){
            branchOprion.push(<Option key={branches[i]}>{branches[i]}</Option>)
        }
        return branchOprion;
    }

    //初始化目标分支
    initialTargetBranch(selectSourceBranch,targetBranches){
        for(let i=0; i<targetBranches.length; i++){
            if(selectSourceBranch == targetBranches[i]){
                return (targetBranches[i]);
            }
        }
    }

    //修改源分支内容，目标分支跟着改变
    changeTargetBranch(value){
        const targetBranches = this.props.mergeBranch?this.props.mergeBranch[1].branches:[];
        let target_branch = null;
        for(let i=0; i<targetBranches.length; i++){
            if(value == targetBranches[i]){
                target_branch = targetBranches[i];
                break;
            }
        }
        this.props.form.setFieldsValue({target_branch: target_branch});

    }

    beforeUpload(file){
        // console.log(file);
        var len = file.name.length;
        // if (!(file.type === 'application/msword')) {
        if (!(file.name.substr(len-4,4).toLowerCase() == '.doc')) {
            message.error('上传的设计文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
            return false;
        }

        if(file.size/ 1024 / 1024 > 10){
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
        }.bind(this);
        reader.readAsDataURL(file);
        //reader.readAsArrayBuffer(file);
        this.props.form.setFieldsValue({'developer_test_file':this.state.fileList});
        return false;
    }


    render(){

        const {record} = this.props.location.state;
        const { getFieldDecorator } = this.props.form;
        const {mergeBranch} = this.props;
        let targetPath,initSourcePath,initTargetPath;//,sourceBranch,initialSourceBranch
        let sourcePath=[]; //targetBranch=[],initialTargetBranchAll=[];
        if(mergeBranch && mergeBranch.length>1){
                initTargetPath = mergeBranch[0].path_with_namespace;
                initSourcePath = mergeBranch[1].path_with_namespace;
                targetPath = <Option key={mergeBranch[0].path_with_namespace}>{mergeBranch[0].path_with_namespace}</Option>;
                sourcePath=[];
                for(let i=1; i<mergeBranch.length; i++){
                    sourcePath.push(<Option key={mergeBranch[i].path_with_namespace}>{mergeBranch[i].path_with_namespace}</Option>)
                }
                // sourceBranch = this.mapSelectOption(mergeBranch[0].branches);
                // targetBranch = this.mapSelectOption(mergeBranch[1].branches);
                // initialSourceBranch = mergeBranch[0].branches[0];
                // initialTargetBranchAll = mergeBranch[1].branches;
        }

        // const initialTargetBranch = this.initialTargetBranch(initialSourceBranch,initialTargetBranchAll);
        const issuesOptions = this.props.issues?this.props.issues.map(data => <Option key={data.id}>{data.title}</Option>):(record?<Option key={record.id}>{record.issue_name}</Option>:[]);
        let assign = this.props.mrAssignee?this.props.mrAssignee.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

            return (
                <Box title='创建代码合并请求'>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <Row>
                            <Col span="9">
                                <FormItem labelCol={{span: 16}} wrapperCol={{span: 4}} label="源分支">
                                    {getFieldDecorator('path',{initialValue:initSourcePath})
                                    (<Select style={{width: 200}}>{sourcePath}</Select>)}
                                </FormItem>
                            </Col>

                            <Col span="3" offset="1">
                                <FormItem  {...formItemLayout} label="">
                                    {getFieldDecorator('source_branch', {initialValue: 'dev'})
                                    (<Select style={{width: 100, marginLeft: 5}}
                                             onSelect={this.changeTargetBranch.bind(this)}>
                                        <Option key='dev'>dev</Option></Select>)}
                                </FormItem>
                            </Col>

                            <Col span="4">
                                <FormItem labelCol={{span: 7}} wrapperCol={{span: 14}} label="目标分支">
                                    {getFieldDecorator('target_project_path',{initialValue:initTargetPath})
                                    (<Select style={{width: 200}}>{targetPath}</Select>)}
                                </FormItem>
                            </Col>

                            <Col span="6" offset="1">
                                <FormItem required={true} {...formItemLayout} label="">
                                    {getFieldDecorator('target_branch', {
                                        initialValue: 'dev'
                                    })
                                    (<Select style={{width: 100, marginLeft: 5}}><Option
                                        key='dev'>dev</Option></Select>)}
                                </FormItem>
                            </Col>
                        </Row>

                        <FormItem {...formItemLayout} label="MR名称">
                            {getFieldDecorator('title', {
                                rules: [{required: true, message: '请填写MR名称'},
                                    {max: 30, message: 'MR名称长度最大30个字符'}]
                            })(<Input placeholder="请输入MR名称"/>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="MR描述">
                            {getFieldDecorator('description', {rules: [{required: true, message: '请填写MR描述'}]})(
                                <Input type="textarea" placeholder="请输入MR描述" rows="5"/>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="问题">
                            {getFieldDecorator('issue_id', {rules: [{required: true, message: '请选择对应问题'}]})(
                                <Select size="large" allowClear={true} >{issuesOptions}</Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="审批人">
                            {getFieldDecorator('assignee.id', {rules: [{required: true, message: '不能为空'}]})(
                                <Select size="large" >{assign}</Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout}  label="自测报告上传">
                            {getFieldDecorator('developer_test_file',{rules:[{required:true,type:"array",message:'请上传文档'}]})(
                                <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>)}
                        </FormItem>

                        <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading}>确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>);
    }
}

CreateMergeRequest.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {

        mergeBranch : state.mergeRequest.mergeBranch,
        loginInfo:state.login.profile,
        loading:state.mergeRequest.createLoading,
        inserted: state.mergeRequest.createResult,
        issues: state.mergeRequest.Issues,
        mrAssignee:state.mergeRequest.mrAssignee,
    };
}

function mapDispatchToProps(dispatch){
    return{

        fetchMrListData : bindActionCreators(fetchMrListData,dispatch),
        createMr: bindActionCreators(createMr,dispatch),
        fetchMergeAssign:bindActionCreators(fetchMergeAssign,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(CreateMergeRequest));