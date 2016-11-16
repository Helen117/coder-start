/**
 * Created by Administrator on 2016-11-15.
 */
/**
 * Created by Administrator on 2016-11-09.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification,Modal} from 'antd';
import 'pubsub-js';
import {UpdateUser} from './actions/user-detail-action';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form,loginInfo,UpdateUser } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                let data = {};
                data.user_id = loginInfo.userId;
                data.password = formData.old_password;
                data.new_password = formData.new_password;
                //调修改成员信息接口
                UpdateUser(data);
            }
        })
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

    insertCallback(message){
        notification.success({
            message: message,
            description: '',
            duration: 2
        });
        this.context.router.goBack();
    }

    errCallback(message,errmessage){
        notification.error({
            message: message,
            description:errmessage,
            duration: 4
        });
    }

    componentWillReceiveProps(nextProps) {
        const {updateResult, updateErrors} = nextProps;
        //修改返回信息
        if (this.props.updateResult != updateResult && updateResult) {
            this.insertCallback("修改成功");
        } else if (this.props.updateErrors != updateErrors && updateErrors) {
            this.errCallback("修改失败",updateErrors);
        }
    }

    comfirmNewPass(rule, value, callback){//确认新密码
        const {getFieldValue} = this.props.form;
        if (value && value !== getFieldValue('new_password')) {
            callback('两次密码输入不一致!');
        } else {
            callback();
        }
    }

    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 8},
        };
        const oldPasswordProps = getFieldProps('old_password',
            {rules:[
                {required:true, message:'请输入原始密码！'},
            ]});
        const newPasswordProps = getFieldProps('new_password',
            {rules:[
                {required:true, message:'请输入新密码！'},
            ]});
        const comfirmNewPassword = getFieldProps('comfirm_password',
            {rules:[
                {required:true, message:'请输入新密码！'},
                {validator: this.comfirmNewPass.bind(this)}
            ]});

        return(
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormItem {...formItemLayout} label="原密码">
                    <Input type="password" {...oldPasswordProps} placeholder="请输入原密码"/>
                </FormItem>

                <FormItem {...formItemLayout} label="新密码">
                    <Input type="password" {...newPasswordProps} placeholder="请输入新密码"/>
                </FormItem>

                <FormItem {...formItemLayout} label="确认新密码">
                    <Input type="password" {...comfirmNewPassword} placeholder="请再次输入新密码"/>
                </FormItem>

                <FormItem wrapperCol={{span: 10, offset: 7}} style={{marginTop: 24}}>
                    <Button type="primary" htmlType="submit"
                            loading={this.props.updateLoading}
                            disabled={this.props.updateDisabled}>
                        确定</Button>
                    <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                </FormItem>
            </Form>
        )
    }
}

UpdatePassword.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UpdatePassword = Form.create()(UpdatePassword);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        updateResult:state.createUser.updateResult,
        updateErrors:state.createUser.updateErrors,
        updateLoading:state.createUser.updateLoading,
        updateDisabled:state.createUser.updateDisabled,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateUser:bindActionCreators(UpdateUser, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);