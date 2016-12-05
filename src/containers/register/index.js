/**
 * Created by helen on 2016/9/14.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Tooltip,notification,Spin  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import {checkName} from '../../utils/regValidate'
import * as register from './actions/register-action';

const FormItem = Form.Item;
const Option = Select.Option;
// const userName =[];
message.config({
    top: 100,
    duration: 2,
});

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {error:''};
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentWillMount(){
        const { actions } = this.props;
        actions.getLeader();
        actions.getRole();
        actions.getOrganization();
        // actions.getAllUser();
    }

    componentWillReceiveProps(nextProps) {
        const result = nextProps.registerResult;
        const registering = nextProps.registering;

        // const user = nextProps.registerState.users;
        // if(userName&&userName.length<=0 && this.props.registerState.users) {
        //     for(var i =0;i<user.length;i++){
        //         userName.push(user[i].username);
        //     }
        // }

        if (!registering && result && result!=this.props.registerResult) {
            message.success('提交成功，等待审批！');
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

            // console.log('user:',userName);
            // if(!(userName.length>0)){
            //     callback();
            // }
            // for(var i =0;i<userName.length;i++){
            //     if (value == userName[i]) {
            //         callback(new Error('抱歉,该用户名已被占用!'));
            //     } else {
            //         callback();
            //     }
            // }

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
        const { getFieldDecorator } = this.props.form;

        const pending = this.props.getLeaderPending||this.props.getOrganizePending||this.props.getRolePending?true:false;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        };
        const selectAfter = getFieldDecorator('option',{initialValue:'@shpso.com'})(
                 <Select style={{ width: 105 }}>
                    <Option value="@shpso.com">@shpso.com</Option>
                    <Option value="@boss.com">@boss.com</Option>
                </Select>);

        const leader = this.props.leaderInfo?this.props.leaderInfo.map(data => <Option key={data.leader_id}>{data.leader_name}</Option>):[];

        const role = this.props.role?this.props.role.map(data => <Option key={data.id}>{data.description}</Option>):[];

        const organization = this.props.organization?this.props.organization.map(data => <Option key={data.organization_id}>{data.organization_name}</Option>):[];

        return (
            <Spin spinning={pending}>
                <Box title='新用户注册'>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout}  label="用户名" >
                            {getFieldDecorator('username',{rules:[{ required:true,message:'不能为空'},{validator:this.userExists}]})(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout}  label="中文名" >
                            {getFieldDecorator('name',{rules:[{required:true,message:'不能为空'},{validator:checkName}]})(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout}  label="邮箱" >
                            {getFieldDecorator('email',{rules:[{required:true,message:'不能为空'},{validator:this.checkEmail}]})(<Input addonAfter={selectAfter}/> )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="密码" >
                            {getFieldDecorator('password',{rules:[{required:true,min:8,max:18,message:'密码为8-18个字符'}]})(<Input type="password"  />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="ssh key" >
                            {getFieldDecorator('sshKey',{rules:[{required:true,message:'ssh key不能为空'}]})(<Input style={{ width: '80%', marginRight: 8 }} type="textarea" rows="4" />)}
                            <Tooltip placement="right" title="1、下载Git-Bash,运行git-bash.exe;
                            2、生成密钥对：ssh-keygen -t rsa -C “你的邮箱”;
                            3、打开文件:notepad ~/.ssh/id_rsa.pub">
                                <a href="/assets/tool/Git-Bash.exe" >Git-Bash 下载</a>
                            </Tooltip>
                        </FormItem>

                        <FormItem {...formItemLayout} label="申请角色" >
                            {getFieldDecorator('role_id',{rules:[{required:true,message:'请选择申请的角色'}]})
                                (<Select showSearch
                                    showArrow={false}
                                    optionFilterProp="children"
                                    notFoundContent="无法找到">
                                    {role}
                                </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="申请厂商" >
                            {getFieldDecorator('organization_id',{rules:[{required:true,message:'请选择申请的厂商'}]})
                            (<Select showSearch
                                     showArrow={false}
                                     optionFilterProp="children"
                                     notFoundContent="无法找到">
                                {organization}
                            </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout}  label="上级领导" >
                                {getFieldDecorator('leader_id',{rules:[{required:true,message:'请选择需审批的上级领导'}]})(
                                    <Select showSearch
                                            showArrow={false}
                                            optionFilterProp="children"
                                            notFoundContent="无法找到">
                                        {leader}
                                    </Select>)}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 16, offset: 8 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" loading={this.props.registering}>提交</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>
            </Spin>
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
        registering:state.register.registering,
        registerResult:state.register.registerResult,
        getLeaderPending:state.register.getLeaderPending,
        leaderInfo:state.register.leader,
        getOrganizePending:state.register.getOrganizePending,
        organization:state.register.organization,
        getRolePending:state.register.getRolePending,
        role:state.register.role,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(register,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Register);
