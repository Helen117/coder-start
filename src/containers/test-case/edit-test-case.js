/**
 * Created by helen on 2016/11/23.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class EditTestCase extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        const {selectedRow} = this.props.location.state;
        if(selectedRow){
            const {setFieldsValue} = this.props.form;
            setFieldsValue(selectedRow);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo} = this.props;
        const {editType, selectedRow} = this.props.location.state;

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {

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

    render() {

        const {editType} = this.props.location.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };

        return (
                <Box title={editType == 'add' ? '新增测试案例' : '修改测试案例'}>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout}  label="案例名称" >
                            {getFieldDecorator('case_name',{rules:[{ required:true,message:'不能为空'}]})(<Input/>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="测试类型" >
                            {getFieldDecorator('test_type',{rules:[{required:true,message:'请选择测试类型'}]})(
                                <Select id="test_type">
                                    <Option value="function">功能测试</Option>
                                    <Option value="defect">异常测试</Option>
                                    <Option value="bug" >回归测试</Option>
                                </Select>)
                            }
                        </FormItem>

                        <FormItem {...formItemLayout} label="测试功能" >
                            {getFieldDecorator('test_function',{rules:[{required:true,message:'不能为空'}]})(<Input />)}
                        </FormItem>


                        <FormItem {...formItemLayout} label="测试步骤" >
                            {getFieldDecorator('test_step',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" rows="5" />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="测试数据" >
                            {getFieldDecorator('test_data',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" rows="5" />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="相关SQL" >
                            {getFieldDecorator('sql',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" rows="5" />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="预期结果" >
                            {getFieldDecorator('expected_result',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" rows="5" />)}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">提交</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>
        );
    }
}

EditTestCase.contextTypes = {
    router: PropTypes.object.isRequired
};

export default EditTestCase = Form.create()(EditTestCase);