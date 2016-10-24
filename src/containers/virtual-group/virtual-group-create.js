/**
 * Created by zhaojp on 2016/10/24.
 */
import React,{ PropTypes } from 'react';
import { Transfer, Button, Form ,Modal, Input,Spin, notification} from 'antd';
import Box from '../../components/box';
import TransferFilter from '../../components/transfer-filter';
import fetchProjectMsg from './actions/fetch-project-msg-action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class virtualGroupCreate extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys=[];
    }

    componentDidMount() {
        const username = this.props.logInfo.username;
        this.props.fetchProjectMsg(username);
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage } = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }

    }

    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '创建成功',
            duration: 2
        });
        this.props.getMilestones(this.projectId, 1, []);
        this.context.router.goBack();
    }

    errCallback(errMessage){
        notification.error({
            message: '创建失败',
            description: errMessage,
            duration: 2
        });
    }

    handleChange(targetKeys){
        this.targetKeys = targetKeys;
        console.log('project',this.targetKeys);
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
        const {form,logInfo } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                formData.project_list = this.targetKeys;
                formData.username = logInfo.username;
                console.log('formData',formData);
            }
        })
    }

    render(){
        const {getFieldProps} = this.props.form;
        const titleProps = getFieldProps('title', {
            rules: [
                { required: true, message:'请输入虚拟组名称' },
                { max: 30, message: '名称长度最大 30 个字符' },
            ],
        });
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        return (
            <Box title="创建虚拟组">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                    <FormItem   {...formItemLayout} label="名称">
                        <Input {...titleProps} placeholder="请输入虚拟组名称" />
                    </FormItem>

                    <FormItem   {...formItemLayout} label="描述">
                        <Input type="textarea" rows="5" {...getFieldProps('description')} placeholder="请输入虚拟组描述 " />
                    </FormItem>

                    <FormItem   {...formItemLayout} label="项目">
                        {this.props.loading?
                            <Spin ><TransferFilter dataSource = {this.props.projectInfo} {...getFieldProps('project_list')} onChange={this.handleChange.bind(this)}/></Spin>
                            :<TransferFilter dataSource = {this.props.projectInfo} {...getFieldProps('project_list')} onChange={this.handleChange.bind(this)}/>}
                    </FormItem>

                    <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit" loading={this.props.loading} disabled={this.props.disabled}>确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
        );
    }
}

virtualGroupCreate.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        logInfo: state.login.profile,
        projectInfo: state.fetchProMsg.items,
        inserted: state.createVirtualGroup.items,
        errMessage: state.createVirtualGroup.errors,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectMsg: bindActionCreators(fetchProjectMsg, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(virtualGroupCreate));
