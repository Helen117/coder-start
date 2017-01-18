/**
 * Created by zhaojp on 2016/10/11.
 */

import React,{ PropTypes, Component } from 'react';
import { Col, Button, Modal, Form, Input, Select,notification,message} from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchBranchesData,createBranch} from './branches-action';


const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class CreateBranches extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {project} = this.props;
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(projectInfo.id) {
            this.props.fetchBranchesData(projectInfo.id);
        }else{
            const {router} = this.context;
            router.goBack();
            this.errCallback('未选择项目','请先在“代码管理“中选择一个项目！');
        }

    }

    componentWillReceiveProps(nextProps) {
        const { createResult } = nextProps;
        if (this.props.createResult != createResult && createResult){
            this.insertCallback('创建成功');
        }
    }

    insertCallback(type){
        const {project} = this.props;
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        message.success(type);
        this.context.router.goBack();
        this.props.fetchBranchesData(projectInfo.id);
    }
    
    titleExists(rule, value, callback){
        const {branchesData} = this.props;
        if (!value) {
            callback();
        } else {
            let isExit  = false;
            setTimeout(() => {
                for( let i=0; i<=branchesData.branch.length;i++){
                    if (value === branchesData.branch[i]) {
                        isExit = true;
                        break;
                    }
                }
                if(isExit){
                    callback([new Error('该分支已经存在')]);
                }else {
                    callback();
                }
            }, 500);
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
                //do nothing
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const {project,loginInfo} = this.props;
        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const {form} = this.props;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.project_id=projectInfo.id;
                data.username = loginInfo.username;
                this.props.createBranch(data);
            }
        })

    }

    render(){
        const {editType} = this.props.location.state;
        const { getFieldDecorator } = this.props.form;
        const {branchesData} = this.props;

        const branches =branchesData? branchesData.branch.map(data => <Option key={data}>{data}</Option>):[];
        const initialBranch = branchesData? branchesData.branch[0]:null;

        const newBranchProps = getFieldDecorator('new_branch', {
            rules: [
                { required: true,message: '请输入分支名称', },
                {max: 30,message: '分支名称需在30字符以内'},
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

                    <FormItem {...formItemLayout}  label="新分支名称" >
                        {newBranchProps(<Input placeholder="请输入分支名称" />)}

                    </FormItem>

                    <FormItem {...formItemLayout}  label="源分支名称" >
                        {getFieldDecorator('ref_branch',{initialValue: initialBranch})(<Select>{branches}</Select>)}

                </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" loading={this.props.createLoading}>确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
        );
    }
}

CreateBranches.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        branchesData: state.branch.branchesData,
        createLoading:state.branch.createLoading,
        createResult: state.branch.createResult,
        project:state.project,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchBranchesData : bindActionCreators(fetchBranchesData,dispatch),
        createBranch: bindActionCreators(createBranch,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(CreateBranches));
