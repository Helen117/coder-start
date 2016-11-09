/**
 * Created by zhaojp on 2016/10/8.
 */
import React,{ PropTypes, Component } from 'react';
import { Col, Row, Button, Modal, Form, Input, Select,notification,Cascader,message } from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchMessageAction from './actions/fetch-datasource-action';
import fetchMrListData from './actions/mergeRequest-list-action'
import {createMr} from './actions/mergeRequest-edit-action';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class createMergeRequest extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {router} = this.context;
        if(this.props.getProjectInfo) {
            this.props.fetchMessage.fetchMergeBranchData(this.props.getProjectInfo.id);
            this.props.fetchMessage.fetchSourceProData(this.props.getProjectInfo.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage ,isMR} = nextProps;
        if(this.props.isMR != isMR && isMR==false){
            this.errCallback('无需MR','该分支是根节点，无需向其他分支MR');
        }
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback('创建失败',errMessage);
        }
    }

    insertCallback(type){
        message.success(type+'成功');
        this.props.fetchMrListData(this.props.mergeBranch[1].id);
        this.context.router.goBack();
    }

    errCallback(type,errMessage,){
        notification.error({
            message: type,
            description:errMessage,
            duration: 2
        });
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
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const {mergeBranch,loginInfo} = this.props;
        const author = {};
        author.username= loginInfo.username;
        const {form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.project_id=mergeBranch[0].id;
                data.target_project_id = mergeBranch[1].id;
                data.author = author;
                this.props.createMr(data);
            }
        })

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


    loadIssues(value){

        const projectId = this.props.mergeBranch[0].id;
        const milestonesId = value;
        if (milestonesId && projectId){
            this.props.fetchMessage.fetchIssuesData(milestonesId,projectId);
        }
    }
    //修改源分支内容，目标分支跟着改变
    changeTargetBranch(value){
        const targetBranches = this.props.mergeBranch?this.props.mergeBranch[1].branches:[]
        let i=0
        for(i=0; i<targetBranches.length; i++){
            if(value == targetBranches[i]){
                this.props.form.setFieldsValue({target_branch: targetBranches[i]});
                break;
            }
        }
        if(i >= targetBranches.length) {
            this.props.form.setFieldsValue({target_branch: null});
        }

    }


    render(){
        const {editType} = this.props.location.state;
        const { getFieldProps } = this.props.form;
        const {mergeBranch} = this.props;
        let targetPath,sourceBranch,initialSourceBranch;
        let sourcePath=[],targetBranch=[],initialTargetBranchAll=[];
        if(mergeBranch){
            if(mergeBranch.length>1){
                sourcePath = mergeBranch[0].path_with_namespace;
                targetPath = mergeBranch[1].path_with_namespace;
                sourceBranch = this.mapSelectOption(mergeBranch[0].branches);
                targetBranch = this.mapSelectOption(mergeBranch[1].branches);
                initialSourceBranch = mergeBranch[0].branches[0];
                initialTargetBranchAll = mergeBranch[1].branches;
            }
        }

        const initialTargetBranch = this.initialTargetBranch(initialSourceBranch,initialTargetBranchAll);
        const mileStoneOptions =this.props.milestones? this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const issuesOptions = this.props.issues?this.props.issues.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <Box title={editType == 'add' ? '添加MR' : '修改MR'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <Row>
                        <Col span="9">
                            <FormItem  labelCol={{ span: 16 }} wrapperCol={{ span: 4 }} label="源分支">
                                <Select style={{ width: 200 }} {...getFieldProps('path',{initialValue: sourcePath,rules: [{ required: true, message: '请选择源分支' }]})} >
                                    <Option key={sourcePath}>{sourcePath}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="3" offset="1">
                            <FormItem  {...formItemLayout} label="" >
                                <Select style={{ width: 100,marginLeft:5 }}
                                        onSelect={this.changeTargetBranch.bind(this)}
                                        {...getFieldProps('source_branch',{initialValue: initialSourceBranch})} >
                                        {sourceBranch}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem  {...formItemLayout} label="目标分支" >
                                <Select disabled={true}
                                        style={{ width: 200 }}
                                        {...getFieldProps('target_project_path',{initialValue: targetPath})} >
                                    <Option value={targetPath}>{targetPath}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6" offset="1">
                            <FormItem required={true} {...formItemLayout} label="">
                               <Select disabled={true}
                                       style={{ width: 100,marginLeft:5 }}
                                       {...getFieldProps('target_branch',
                                           {initialValue: initialTargetBranch, rules:[{required:true,message:'没有与其对应的目标分支'}]})} >
                                    {targetBranch}
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem {...formItemLayout}  label="MR名称" >
                        <Input placeholder="请输入MR名称"
                               {...getFieldProps('title',
                                   {rules:[{ required:true,message:'请填写MR名称'},
                                       { max:30,message:'MR名称长度最大30个字符'}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="MR描述" >
                        <Input type="textarea"
                               placeholder="请输入MR描述"
                               rows="5"
                               {...getFieldProps('description',
                                   {rules:[{required:true,message:'请填写MR描述'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="里程碑"  >
                        <Select size="large"
                                allowClear={true}
                                {...getFieldProps('milestone.id')}
                                onSelect={this.loadIssues.bind(this)}>
                            {mileStoneOptions}
                        </Select>
                    </FormItem>

                    <FormItem {...formItemLayout} label="问题">
                        <Select size="large"
                                allowClear={true}
                                {...getFieldProps('issue_id')} >
                            {issuesOptions}
                        </Select>
                    </FormItem>

                    <FormItem {...formItemLayout} label="MR标签" >
                        <Select multiple size="large"  {...getFieldProps('labels')} >
                            {label}
                        </Select>
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
        isMR: state.fetchMergeBranchData.isMR,
        mergeBranch : state.fetchMergeBranchData.mergeBranch,
        loginInfo:state.login.profile,
        getProjectInfo:state.getProjectInfo.projectInfo,
        loading:state.createMr.loading,
        disabled:state.createMr.disabled,
        inserted: state.createMr.result,
        errMessage:state.createMr.errors,
        issues: state.fetchIssuesData.Issues,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchMrListData : bindActionCreators(fetchMrListData,dispatch),
        fetchMessage : bindActionCreators(fetchMessageAction,dispatch),
        createMr: bindActionCreators(createMr,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(createMergeRequest));