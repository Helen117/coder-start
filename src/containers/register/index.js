/**
 * Created by helen on 2016/9/14.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import {checkName} from '../../utils/regValidate'
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
    // componentWillMount(){
    //     const { actions } = this.props;
    //     actions.userExists();
    // }
    componentWillReceiveProps(nextProps) {
        const result = nextProps.registerState.registerResult;
        const error = nextProps.registerState.errors;
        const registering = nextProps.registerState.registering;
        // const userExists = nextProps.registerState.userExists;

        // if(userExists && this.props.registerState.userExists==null) {
        //     userName.push(nextProps.registerState.userExists.username);
        // }

        if(error&& error != this.props.registerState.errors){
            message.error('注册失败！'+error);
        }
        if (!registering && !error && result && result!=this.props.registerState.registerResult) {
            message.success('注册成功！');
            this.context.router.replace('/login');
        }
    }

    userExists(rule, value, callback) {
        var reg = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
        if (!value) {
            callback();
        } else {
            if(!reg.test(value)){
                callback('用户名可以由字母、数字、下划线组成，以字母开头，长度为4-16位。');
            }else {
                callback();
            }
            // console.log('userName:',userName);
            // if(!(userName.length>0)){
            //     callback();
            // }
            // for(var i =0;i<userName.length;i++){
            //     if (value == userName[i]) {
            //         callback([new Error('抱歉，该用户名已被占用。')]);
            //     } else {
            //         callback();
            //     }
            // }

        }

    }

    // handleChange(value) {
    //     console.log('value:',value);
    //     let options;
    //     if (!value || value.indexOf('@') >= 0) {
    //         options = [];
    //     } else {
    //         options = ['shpso.com', 'boss.com'].map((domain) => {
    //             const email = `${value}@${domain}`;
    //             return <Option key={email}>{email}</Option>;
    //         });
    //     }
    //     this.setState({
    //         options
    //     });
    //
    // }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.email = data.email+data.option;
               // console.log('收到表单值：', data);
                actions.register(data);
            }
        })
    }
    handleCancel(){
        this.props.form.resetFields();
        this.context.router.replace('/login');
    }

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }

    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        };
        const selectAfter = (
            <Select {...getFieldProps('option',{initialValue:'@shpso.com'})} style={{ width: 100 }}>
                <Option value="@shpso.com">@shpso.com</Option>
                <Option value="@boss.com">@boss.com</Option>
            </Select>
        );

        return (
            <Box title='新用户注册'>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout}  label="用户名" >
                        <Input placeholder="userName" {...getFieldProps('username',{rules:[{ required:true,message:'不能为空'},{validator:this.userExists}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout}  label="中文名" >
                        <Input placeholder="Name" {...getFieldProps('name',{rules:[{required:true,message:'不能为空'},{validator:checkName}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout}  label="邮箱" >
                        <Input placeholder="email"  {...getFieldProps('email',{rules:[{required:true,message:'邮箱不能为空'}]})} addonAfter={selectAfter}/>
                    </FormItem>

                    <FormItem {...formItemLayout} label="密码" >
                        <Input type="password" {...getFieldProps('password',{rules:[{required:true,min:8,max:18,message:'密码为8-18个字符'}]})} placeholder="password" />
                    </FormItem>

                    <FormItem {...formItemLayout} label="ssh key" >
                        <Input style={{ width: '80%', marginRight: 8 }} type="textarea" placeholder="1、下载Git-Bash;
                        2、生成密钥对：ssh-keygen -t rsa -C “你的邮箱”;
                        3、打开文件~/.ssh/id_rsa.pub，然后将公钥复制过来." rows="4" {...getFieldProps('sshKey',{rules:[{required:true,message:'ssh key不能为空'}]})} />
                        <a href="/assets/tool/Git-Bash.exe">Git-Bash 下载</a>
                    </FormItem>

                    <FormItem {...formItemLayout} label="申请角色" >
                        <Select id="role"  {...getFieldProps('role',{initialValue:'developer',rules:[{required:true,message:'请选择申请角色'}]})} >
                            <Option value="tester">测试人员</Option>
                            <Option value="developer">开发人员</Option>
                            <Option value="compiler" >BM</Option>
                            <Option value="master">负责人</Option>
                        </Select>
                    </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 8 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
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
