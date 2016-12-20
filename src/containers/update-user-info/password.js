/**
 * Created by Administrator on 2016-11-15.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification,Modal} from 'antd';
import 'pubsub-js';
import {UpdateUser} from './actions/update-user-info-action';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            visible:false,
            passwordDirty:false,
        }
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
        form.resetFields();
    }

    insertCallback(message){
        const {form} = this.props;
        notification.success({
            message: message,
            description: '',
            duration: null,
        });
        form.resetFields();
    }

    componentWillReceiveProps(nextProps) {
        const {UserInfo} = nextProps;
        const {visible} = this.props;
        //修改返回信息
        if(visible == true && this.props.UserInfo && UserInfo){
            if (this.props.UserInfo.updateResult != UserInfo.updateResult && UserInfo.updateResult) {
                this.insertCallback("修改成功");
            }
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

    handlePasswordBlur(e){
        const value = e.target.value;
        console.log('!!value:',!!value)
        console.log('this.state.passwordDirty---:',this.state.passwordDirty)
        this.setState({ passwordDirty: this.state.passwordDirty || !!value });
    }

    checkConfirm(rule, value, callback){
        const form = this.props.form;
        console.log('value:',value)
        console.log('this.state.passwordDirty:',this.state.passwordDirty)
        if (value && this.state.passwordDirty) {
            form.validateFields(['comfirm_password'], { force: true });
        }
        callback();
    }

    render() {
        const {visible} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 8},
        };
        const oldPasswordProps = getFieldDecorator('old_password',
            {rules:[
                {required:true, message:'请输入原始密码！'},
            ]})(<Input type="password" placeholder="请输入原密码"/>);
        const newPasswordProps = getFieldDecorator('new_password',
            {rules:[
                {required:true, message:'请输入新密码！'},
                {validator: this.checkConfirm.bind(this),},
            ]})(<Input type="password" placeholder="请输入新密码"
                       onBlur={this.handlePasswordBlur.bind(this)}/>);
        const comfirmNewPassword = getFieldDecorator('comfirm_password',
            {rules:[
                {required:true, message:'请再次输入新密码！'},
                {validator: this.comfirmNewPass.bind(this)}
            ]})(<Input type="password" placeholder="请再次输入新密码"/>);
        let showPassword = this.state.visible;
        if(visible){ showPassword = true }

        if(showPassword == true){
            return(
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="原密码">
                        {oldPasswordProps}
                    </FormItem>

                    <FormItem {...formItemLayout} label="新密码">
                        {newPasswordProps}
                    </FormItem>

                    <FormItem {...formItemLayout} label="确认新密码">
                        {comfirmNewPassword}
                    </FormItem>

                    <FormItem wrapperCol={{span: 10, offset: 7}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit"
                                loading={this.props.updateLoading}
                                disabled={this.props.updateDisabled}>
                            确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>重置</Button>
                    </FormItem>
                </Form>
            )
        }else {return <div></div>}
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
        UserInfo:state.UpdateUserInfo.UserInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateUser:bindActionCreators(UpdateUser, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);