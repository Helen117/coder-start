/**
 * Created by Administrator on 2016-11-18.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification,Modal,Select} from 'antd';
import 'pubsub-js';
import {UpdateUser} from './actions/user-detail-action';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class UpdateBasicInfo extends React.Component {
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

    checkEmail(rule, value, callback){
        var reg = /^[a-z0-9_\.\-]*$/;
        if (!value) {
            callback();
        } else {
            if (!reg.test(value)) {
                callback('请输入正确的邮箱！');
            } else {
                callback();
            }
        }
    }

    render() {
        console.log("this.props.loginInfo:",this.props.loginInfo)
        const {visible} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 8},
        };
        const nameProps = getFieldDecorator('name',
            {rules:[
                {required:true, message:'请输入中文名！'},
            ]})(<Input type="text" placeholder="请输入中文名"/>);
        const selectAfter = getFieldDecorator('option',{initialValue:'@shpso.com'})(
            <Select style={{ width: 100 }}>
                <Option value="@shpso.com">@shpso.com</Option>
                <Option value="@boss.com">@boss.com</Option>
            </Select>
        );

        if(visible == true){
            return(
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="中文名">
                        {nameProps}
                    </FormItem>

                    <FormItem {...formItemLayout}  label="邮箱" >
                        {getFieldDecorator('email',{rules:[{
                            required:true,message:'不能为空'},{validator:this.checkEmail}]})(
                            <Input placeholder="邮箱" addonAfter={selectAfter}/>
                        )}
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

UpdateBasicInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UpdateBasicInfo = Form.create()(UpdateBasicInfo);

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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBasicInfo);