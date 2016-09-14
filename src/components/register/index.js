/**
 * Created by helen on 2016/9/14.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
    }

    handleSelectChange(value) {
        console.log(`selected ${value}`);
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
                    <Input placeholder="userName" {...getFieldProps('userName')} />
                </FormItem>
                <FormItem {...formItemLayout}  label="中文名" >
                    <Input placeholder="Name" {...getFieldProps('name')} />
                </FormItem>
                <FormItem {...formItemLayout}  label="邮箱" >
                    <Input id="email" addonAfter={selectAfter} placeholder="email" {...getFieldProps('email')} />
                </FormItem>

                <FormItem {...formItemLayout} label="密码" >
                    <Input type="password" {...getFieldProps('pass')} placeholder="请输入密码" />
                </FormItem>

                <FormItem {...formItemLayout} label="ssh key" >
                    <Input type="textarea" placeholder="ssh key" rows="3" {...getFieldProps('sshkey')} />
                </FormItem>

                <FormItem {...formItemLayout} label="申请角色" >
                    <Select id="role" size="large" defaultValue="developer" style={{ width: 200 }} {...getFieldProps('role')} >
                        <Option value="tester">测试人员</Option>
                        <Option value="developer">开发人员</Option>
                        <Option value="compiler" >BM</Option>
                        <Option value="master">负责人</Option>
                    </Select>
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>
            </Form>
        );
    }
}

export default  Register = Form.create()(Register);