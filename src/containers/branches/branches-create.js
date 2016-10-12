/**
 * Created by zhaojp on 2016/10/11.
 */

import React,{ PropTypes, Component } from 'react';
import { Col, Button, Modal, Form, Input, Select,notification} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetchBranchesData from './actions/fetch-branches-action';
import createBranch from './actions/branches-create-action';


const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class createBranches extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.getProjectInfo) {
            this.props.fetchBranchesData(this.props.getProjectInfo.gitlabProject.id);
        }else{
            const {router} = this.context;
            router.goBack();
            this.errChosePro();
        }

    }

    errChosePro(){
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
            duration: 2
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
        const { result, errMessage } = nextProps;
        if (this.props.result != result && result){
            console.log('1111111111');
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }
    }

    titleExists(rule, value, callback){
        const {branchesData} = this.props;
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                for( let i=0; i<branchesData.branch.length;i++){
                    if (value === branchesData.branch[i]) {
                        callback([new Error('分支已存在')]);
                    } else {
                        callback();
                    }}
            }, 800);
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
        const {getProjectInfo,loginInfo} = this.props;
        const {form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.project_id=getProjectInfo.gitlabProject.id;
                data.username = loginInfo.username;
                this.props.createBranch(data);
            }
        })

    }

    render(){
        const {editType} = this.props.location.state;
        const { getFieldProps } = this.props.form;
        const {branchesData} = this.props;

        const branches =branchesData? branchesData.branch.map(data => <Option key={data}>{data}</Option>):[];
        const initialBranch = branchesData? branchesData.branch[0]:null;

        const newBranchProps = getFieldProps('new_branch', {
            rules: [
                { required: true,message: '请输入分支名称', },
                { max: 30,message: '分支名称需在30字符以内'},
                { validator: this.titleExists.bind(this) },
            ],
        });

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <Box title={editType == 'add' ? '添加分支' : '修改分支'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                    <FormItem {...formItemLayout}  label="new_branch" >
                        <Input placeholder="请输入分支名称" {...newBranchProps} />
                    </FormItem>

                    <FormItem {...formItemLayout}  label="Create from" >
                        <Select  {...getFieldProps('ref_branch',{initialValue: initialBranch})} >
                            {branches}
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

createBranches.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        getProjectInfo:state.getProjectInfo.projectInfo,
        loginInfo:state.login.profile,
        branchesData: state.fetchBranches.branchesData,
        loading:state.createBranch.loading,
        disabled:state.createBranch.disabled,
        result: state.createBranch.result,
        errMessage:state.createBranch.errors,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchBranchesData : bindActionCreators(fetchBranchesData,dispatch),
        createBranch: bindActionCreators(createBranch,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(createBranches));
