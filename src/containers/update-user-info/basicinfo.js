/**
 * Created by Administrator on 2016-11-18.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification,Modal,Select} from 'antd';
import 'pubsub-js';
import {UpdateUser,getAllUserInfo} from './actions/update-user-info-action';
import {findEmailByUserId} from './utils';

const FormItem = Form.Item;
const Option = Select.Option;

class UpdateBasicInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.getAllUserInfo();
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
                data.name = formData.name;
                data.email = formData.email+formData.option;
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
        notification.success({
            message: message,
            description: '',
            duration: null
        });
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
        const {visible,loginInfo,AllUserInfo} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 8},
        };
        const nameProps = getFieldDecorator('name',
            {rules:[
                {required:true, message:'请输入中文名！'},
            ],initialValue:loginInfo.name})(<Input type="text" placeholder="请输入中文名"/>);
        const selectAfter = getFieldDecorator('option',{initialValue:'@shpso.com'})(
            <Select style={{ width: 100 }}>
                <Option value="@shpso.com">@shpso.com</Option>
                <Option value="@boss.com">@boss.com</Option>
            </Select>
        );

        if(visible == true){
            let initEmail = '';
            if(AllUserInfo){
                if(AllUserInfo.allUserInfo){
                    initEmail = findEmailByUserId(loginInfo.userId,AllUserInfo.allUserInfo);
                }
            }
            return(
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="中文名">
                        {nameProps}
                    </FormItem>

                    <FormItem {...formItemLayout}  label="邮箱" >
                        {getFieldDecorator('email',{rules:[{
                            required:true,message:'不能为空'},{validator:this.checkEmail}],
                            initialValue:initEmail})(
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
        UserInfo:state.UpdateUserInfo.UserInfo,
        AllUserInfo:state.UpdateUserInfo.AllUserInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateUser:bindActionCreators(UpdateUser, dispatch),
        getAllUserInfo:bindActionCreators(getAllUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBasicInfo);