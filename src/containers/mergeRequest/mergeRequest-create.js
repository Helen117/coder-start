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
        if(this.props.getProjectInfo) {
            this.props.fetchMessage.fetchTargetProData(this.props.getProjectInfo.gitlabProject.id);
            this.props.fetchMessage.fetchSourceProData(this.props.getProjectInfo.gitlabProject.id);
        }else{
            const {router} = this.context;
            router.goBack();
            this.errChoosePro();
        }
    }

    errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先选择一个项目！',
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
        const {targetProData,loginInfo} = this.props;
        const author = {};
        author.username= loginInfo.username;
        const {form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                const milestone={}
                milestone.id= data.source_milestone?data.source_milestone.label[2]:null;
                data.milestone = milestone;
                data.target_project_id = data.targetProData[0];
                data.target_branch = data.targetProData[1];
                data.project_id = data.sourceProData[0];
                data.source_branch = data.sourceProData[1];
                data.author = author;
                this.props.createMr(data);
            }
        })

    }


    onSelect(value){
        var id =value.label[2];

    }

    render(){

        const {editType} = this.props.location.state;
        const { getFieldProps } = this.props.form;
        const {targetProData} = this.props;
        const sourceProData = targetProData?[targetProData[0]]:[];
        const initialPath = targetProData?sourceProData[0].label:null;
        const initialBranch = targetProData?sourceProData[0].children[0].label:null;
        const mileStoneOptions =this.props.milestones? this.props.milestones.map(data => <Option value={data.title+data.id} key={data.id}>{data.title}({data.id})</Option>):[];
        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <div style={{marginTop:5,marginLeft:5}}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                    <FormItem {...formItemLayout} label="source branch">
                        <Cascader options={sourceProData} placeholder="请选择source branch" {...getFieldProps('sourceProData',{rules:[{ required:true,type: 'array',message:'请选择 source branch'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="target branch">
                        <Cascader options={targetProData} placeholder="请选择target branch" {...getFieldProps('targetProData',{rules:[{ required:true,type: 'array',message:'请选择 target branch'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout}  label="MR名称" >
                        <Input placeholder="请输入MR名称" {...getFieldProps('title',{rules:[{ required:true,message:'请填写 MR 名称'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="MR描述" >
                        <Input type="请输入MR描述" placeholder="请输入MR描述" rows="5" {...getFieldProps('description',{rules:[{required:true,message:'请填写 MR 描述'}]})} />
                    </FormItem>

                    <FormItem {...formItemLayout} label="里程碑" >
                        <Select showSearch labelInValue={true}  onSelect={this.onSelect.bind(this)}  size="large" placeholder="请选择里程碑" {...getFieldProps('source_milestone')} >
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
            </div>
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