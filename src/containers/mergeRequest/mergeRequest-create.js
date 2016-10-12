/**
 * Created by zhaojp on 2016/10/8.
 */
import React,{ PropTypes, Component } from 'react';
import { Col, Button, Modal, Form, Input, Select,notification,Cascader } from 'antd';
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
        this.props.fetchMessage.fetchTargetProData(17);
        this.props.fetchMessage.fetchSourceProData(17);
        /*if(this.props.getProjectInfo) {
            this.props.fetchMessage.fetchTargetProData(this.props.getProjectInfo.gitlabProject.id);
            this.props.fetchMessage.fetchSourceProData(this.props.getProjectInfo.gitlabProject.id);
        }else{
            const {router} = this.context;
            router.goBack();
            this.errChoosePro();
        }*/
    }

    errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在“代码管理“中选择一个项目！',
            duration: 2
        });
    }

    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '',
            duration: 1
        });
        this.context.router.goBack();
    }

    errCallback(errMessage){
        notification.error({
            message: '创建失败',
            description:errMessage,
            duration: 2
        });
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage } = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
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
        //author.username= loginInfo.username;
        const {form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.project_id=17//getProjectInfo.gitlabProject.id;
                //data.target_project_id = targetProData.id;
                //data.author = author;
                console.log('表单提交内容',data);
                this.props.createMr(data);
            }
        })

    }
    onSelect(value,option){
        console.log('option',option);
    }

    render(){
        console.log('targetProData',this.props.targetProData);
        const {editType} = this.props.location.state;
        const { getFieldProps } = this.props.form;
        const {getProjectInfo,targetProData} = this.props;
        const projectId = getProjectInfo? getProjectInfo.gitlabProject.id:null;
        const sourcePath = getProjectInfo? getProjectInfo.gitlabProject.path_with_namespace:null
        const mileStoneOptions =this.props.milestones? this.props.milestones.map(data => <Option value={data.title} key={data.id}>{data.title}</Option>):[];
        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];
        const targetBranch =targetProData? targetProData.branch.map(data => <Option key={data}>{data}</Option>):[];
        const targetPath = targetProData? targetProData.path_with_namespace:null;
        const initialTargetBranch = targetProData? targetProData.branch[0]:null;
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
                    </FormItem>

                    <FormItem {...formItemLayout} label="dataSam">
                        <Cascader options={targetProData} placeholder="Please select" {...getFieldProps('dataSim')} />
                    </FormItem>


                    <FormItem {...formItemLayout}  label="target branch" >
                        <Select style={{ width: 200 }} {...getFieldProps('target_project_path',{initialValue: targetPath})} >
                            <Option value={targetPath}>{targetPath}</Option>
                        </Select>
                        <Select style={{ width: 80,marginLeft:5 }} {...getFieldProps('target_branch',{initialValue: initialTargetBranch})} >
                            {targetBranch}
                        </Select>
                    </FormItem>






                    <FormItem {...formItemLayout}  label="MR名称" >
                        <Input placeholder="请输入MR名称" {...getFieldProps('title',{rules:[{ required:true,message:'请填写MR名称'}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="MR描述" >
                        <Input type="请输入MR描述" placeholder="请输入MR描述" rows="5" {...getFieldProps('description',{rules:[{required:true,message:'请填写MR描述'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="里程碑" >
                        <Select showSearch onSelect={this.onSelect.bind(this)} labelInValue  size="large" placeholder="请选择里程碑" {...getFieldProps('milestone.id')} >
                            {mileStoneOptions}
                        </Select>

                    </FormItem>

                    <FormItem {...formItemLayout} label="MR标签" >
                        <Select multiple size="large" placeholder="请选择标签" {...getFieldProps('labels')} >
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