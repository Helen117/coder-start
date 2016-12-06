/**
 * Created by zhaojp on 2016/10/8.
 */
import React,{ PropTypes, Component } from 'react';
import { Col, Row, Button, Modal, Form, Input, Select,notification,Cascader,message } from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchMrListData,createMr} from './mergeRequest-action'

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class CreateMergeRequest extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
       /* if(this.props.getProjectInfo) {
            const projectId = this.props.getProjectInfo.id;
            this.props.fetchMergeBranchData(projectId);
            //获取当前项目本人的待办事项
        }*/
    }

    componentWillReceiveProps(nextProps) {
        const { inserted} = nextProps;
        /*if(this.props.mergeBranch != mergeBranch && mergeBranch){
            const userId = this.props.loginInfo.userId;
            console.log('this.props.mergeBranch',mergeBranch)
            this.props.fetchIssuesData(mergeBranch[1].id,userId);
        }
        if(this.props.isMR != isMR && isMR==false){
            this.errCallback('无需合并','该项目是根节点，无需向其他项目合并代码');
        }*/
        if (this.props.inserted != inserted && inserted){
            this.insertCallback("创建成功");
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        let isRender = false;
        const mergeBranch = nextProps.mergeBranch;
        if(mergeBranch){
            if(mergeBranch.length>1) {
                isRender = true;
            }
        }
        return isRender;
    }

    insertCallback(type){
        message.success(type);
        this.props.fetchMrListData(this.props.mergeBranch[1].id);
        this.context.router.goBack();
    }

    errCallback(type,errMessage,){
        notification.error({
            message: type,
            description:errMessage,
            duration: null
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
        const { getFieldDecorator } = this.props.form;
        const {mergeBranch} = this.props;
        let targetPath,sourceBranch,initialSourceBranch;
        let sourcePath=[],targetBranch=[],initialTargetBranchAll=[];
        if(mergeBranch && mergeBranch.length>1){
                sourcePath = mergeBranch[0].path_with_namespace;
                targetPath = mergeBranch[1].path_with_namespace;
                sourceBranch = this.mapSelectOption(mergeBranch[0].branches);
                targetBranch = this.mapSelectOption(mergeBranch[1].branches);
                initialSourceBranch = mergeBranch[0].branches[0];
                initialTargetBranchAll = mergeBranch[1].branches;
        }

        const initialTargetBranch = this.initialTargetBranch(initialSourceBranch,initialTargetBranchAll);
        const issuesOptions = this.props.issues?this.props.issues.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        if(mergeBranch && mergeBranch.length>1){
                return (
                <Box title={editType == 'add' ? '添加MR' : '修改MR'}>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <Row>
                            <Col span="9">
                                <FormItem labelCol={{span: 16}} wrapperCol={{span: 4}} label="源分支">
                                    {getFieldDecorator('path', {
                                        initialValue: sourcePath,
                                        rules: [{ required: true, message: '请选择源分支' }]})
                                    (<Select style={{width: 200}}><Option key={sourcePath}>{sourcePath}</Option></Select>)}
                                </FormItem>
                            </Col>

                           <Col span="3" offset="1">
                                <FormItem  {...formItemLayout} label="">
                                    {getFieldDecorator('source_branch', {initialValue: initialSourceBranch})
                                    (<Select style={{width: 100, marginLeft: 5}} onSelect={this.changeTargetBranch.bind(this)}>
                                        {sourceBranch}</Select>)}
                                </FormItem>
                           </Col>

                            <Col span="4">
                                <FormItem  labelCol={{span: 7}} wrapperCol={{span: 14}} label="目标分支">
                                    {getFieldDecorator('target_project_path', {initialValue: targetPath})
                                    (<Select style={{width: 200}}><Option value={targetPath}>{targetPath}</Option></Select>)}
                                </FormItem>
                            </Col>

                            <Col span="6" offset="1">
                                <FormItem required={true} {...formItemLayout} label="">
                                    {getFieldDecorator('target_branch', {initialValue: initialTargetBranch,
                                        rules: [{required: true, message: '没有与其对应的目标分支'}]})
                                    (<Select style={{width: 100, marginLeft: 5}}>{targetBranch}</Select>)}
                                </FormItem>
                            </Col>
                        </Row>

                        <FormItem {...formItemLayout} label="MR名称">
                            {getFieldDecorator('title', {rules: [{required: true, message: '请填写MR名称'},
                                {max: 30,message: 'MR名称长度最大30个字符'}]})
                            (<Input placeholder="请输入MR名称"/>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="MR描述">
                            {getFieldDecorator('description', {rules: [{required: true, message: '请填写MR描述'}]})
                            (<Input type="textarea" placeholder="请输入MR描述" rows="5"/>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="问题">
                            {getFieldDecorator('issue_id')
                            (<Select size="large" allowClear={true}>{issuesOptions}</Select>)}
                        </FormItem>

                        <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading}>确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>);
        }else {
            return null
        }

    }
}

CreateMergeRequest.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {

        mergeBranch : state.mergeRequest.mergeBranch,
        getProjectInfo:state.getProjectInfo.projectInfo,
        loading:state.mergeRequest.createLoading,
        inserted: state.mergeRequest.createResult,
        issues: state.mergeRequest.Issues,
    };
}

function mapDispatchToProps(dispatch){
    return{

        fetchMrListData : bindActionCreators(fetchMrListData,dispatch),
        createMr: bindActionCreators(createMr,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(CreateMergeRequest));