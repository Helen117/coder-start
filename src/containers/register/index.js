/**
 * Created by helen on 2016/9/14.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
//import {checkName} from '../../utils/regValidate'
import * as register from './actions/register-action';

const FormItem = Form.Item;
const Option = Select.Option;
const userName =[];
message.config({
    top: 100,
    duration: 2,
});

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentWillMount(){
        const { actions } = this.props;
        actions.userExists();
    }
    componentWillReceiveProps(nextProps) {
        const result = nextProps.registerState.registerResult;
        const error = nextProps.registerState.errors;
        const registering = nextProps.registerState.registering;
        const userExists = nextProps.registerState.userExists;

        if(userExists && this.props.registerState.userExists==null) {
            userName.push(nextProps.registerState.userExists.username);
        }

        if(error&& error != this.props.registerState.errors){
            message.error('注册失败！'+error);
        }
        if (!registering && !error && result && result!=this.props.registerState.registerResult) {
            message.success('注册成功！');
            this.context.router.replace('/login.html');
        }
    }

    userExists(rule, value, callback) {
        // var reg =new RegExp ('/^[A-Za-z]{1}[A-Za-z0-9_]{4,16}$/');
        if (!value) {
            callback();
        } else {
            // if(!reg.test(value)){
            //     callback('字母开头，允许4-16字节，允许字母数字下划线');
            // }
            console.log('userName:',userName);
            if(!(userName.length>0)){
                callback();
            }
            for(var i =0;i<userName.length;i++){
                if (value == userName[i]) {
                    callback([new Error('抱歉，该用户名已被占用。')]);
                } else {
                    callback();
                }
            }

        }

    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                console.log('收到表单值：', data);
                actions.register(data);
            }
        })
    }
    handleCancel(){
        this.props.form.resetFields();
        this.context.router.replace('/login.html');
    }

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }

    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const selectAfter = (
            <Select defaultValue="@asiainfo.com" style={{ width: 100 }}>
                <Option value="@shpso.com">@shpso.com</Option>
                <Option value="@boss.com">@boss.com</Option>
                <Option value="@163.com">@163.com</Option>
                <Option value="@qq.com">@qq.com</Option>
            </Select>
        );
        return (
            <Form horizontal onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout}  label="用户名" >
                    <Input placeholder="userName" {...getFieldProps('username',{rules:[{ required:true,min:4,message:'用户名至少为4个字符'},{validator:this.userExists}]})} />
                </FormItem>
                <FormItem {...formItemLayout}  label="中文名" >
                    <Input placeholder="Name" {...getFieldProps('name',{rules:[{required:true,message:'不能为空'}]})} />
                </FormItem>
                <FormItem {...formItemLayout}  label="邮箱" >
                    <Input id="email" placeholder="email" {...getFieldProps('email',{rules:[{required:true,type: 'email', message: '请输入正确的邮箱地址' }]})} />
                </FormItem>

                <FormItem {...formItemLayout} label="密码" >
                    <Input type="password" {...getFieldProps('password',{rules:[{required:true,min:8,max:18,message:'密码为8-18个字符'}]})} placeholder="password" />
                </FormItem>

                <FormItem {...formItemLayout} label="ssh key" >
                    <Input type="textarea" placeholder="1、下载Git-Bash;
                    2、生成密钥对：ssh-keygen -t rsa -C “你的邮箱”;
                    3、打开文件~/.ssh/id_rsa.pub，然后将公钥复制过来." rows="4" {...getFieldProps('sshKey',{rules:[{required:true,message:'ssh key不能为空'}]})} />
                </FormItem>

                <FormItem {...formItemLayout} label="申请角色" >
                    <Select id="role" size="large"  style={{ width: 200 }} {...getFieldProps('role',{initialValue:'developer',rules:[{required:true,message:'请选择申请角色'}]})} >
                        <Option value="tester">测试人员</Option>
                        <Option value="developer">开发人员</Option>
                        <Option value="compiler" >BM</Option>
                        <Option value="master">负责人</Option>
                    </Select>
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                </FormItem>
            </Form>
        );
    }
}

Register.contextTypes = {
    router: PropTypes.object.isRequired
};


Register = Form.create()(Register);


//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        registerState:state.register
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(register,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Register);
