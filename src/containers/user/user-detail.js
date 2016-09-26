/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/8
 */
import React, { PropTypes } from 'react';
import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Modal, notification, InputNumber, Switch, Select} from 'antd';
import Box from '../../components/box';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                console.log('收到表单值：', formData);
                //actions.insert(grid.url, formData)
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
    userExists(rule, value, callback) {
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                if (value === 'xuwz') {
                    callback([new Error('抱歉，该用户名已被占用。')]);
                } else {
                    callback();
                }
            }, 800);
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        console.info('componentDidMount');
        const {selectedRow} = this.props.location.state;
        if (selectedRow){
            const {setFieldsValue} = this.props.form;
            setFieldsValue(selectedRow);
        }
    }


    render() {
        const {editType} = this.props.location.state;
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <Box title={editType == 'add' ? '添加用户' : '修改用户'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="姓名">
                        <Input type="text" {...getFieldProps('name', {initialValue: '', rules:[{ required:true,min:2,message:'用户名至少为2个字符'},{validator:this.userExists}]})} placeholder="请输入姓名"/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="性别">
                        <RadioGroup {...getFieldProps('gender', {initialValue: 'male'})}>
                            <Radio value="male">男的</Radio>
                            <Radio value="female">女的</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="年龄" {...formItemLayout}>
                        <InputNumber min={1} max={10} style={{width:100}} {...getFieldProps('age',{initialValue:3})}/>
                        <span className="ant-form-text"> 岁</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="住址" help="随便写点什么吧">
                        <Input type="textarea" placeholder="你住哪里呀" {...getFieldProps('address', {initialValue: '',rules:[{required:true,message:'真的不打算写点什么吗？'}]})} />
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label={
                                  <span>卖身华府 <Tooltip title="我为秋香"><Icon type="question-circle-o"/></Tooltip></span>
                              }
                    >
                        <Checkbox {...getFieldProps('agreement', {initialValue: false, valuePropName: 'checked'})}>
                            同意
                        </Checkbox>
                    </FormItem>
                    <FormItem label="Checkbox 多选框" {...formItemLayout}>
                        <CheckboxGroup {...getFieldProps('multiCheckbox')} options={[{label:'苹果',value:'Apple'},{label:'梨',value:'Pear'},{label:'橘子',value:'Orange'}]}>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="Switch 开关" {...formItemLayout} required>
                        <Switch {...getFieldProps('switch', { valuePropName: 'checked' })} />
                    </FormItem>
                    <FormItem label="国籍" {...formItemLayout} required>
                        <Select style={{ width: 200 }} {...getFieldProps('select',{rules:[{required:true,message:'请选择您的国籍'}]})} placeholder="请选择国家">
                            <Option value="china">中国</Option>
                            <Option value="use">美国</Option>
                            <Option value="japan">日本</Option>
                            <Option value="korean">韩国</Option>
                            <Option value="Thailand">泰国</Option>
                        </Select>
                    </FormItem>
                    <FormItem{...formItemLayout} label="喜欢的颜色">
                        <Select multiple placeholder="请选择颜色" style={{ width: '100%' }} {...getFieldProps('multiSelect', {rules: [{ required: true, message: '请选择您喜欢的颜色', type: 'array' }]})} >
                            <Option value="red">红色</Option>
                            <Option value="orange">橙色</Option>
                            <Option value="yellow">黄色</Option>
                            <Option value="green">绿色</Option>
                            <Option value="blue">蓝色</Option>
                        </Select>
                    </FormItem>
                    <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit">确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
        );

    }

}

UserDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UserDetail = Form.create()(UserDetail);

export default UserDetail;