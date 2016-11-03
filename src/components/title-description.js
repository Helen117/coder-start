/**
 * Created by zhaojp on 2016/10/10.
 */
import React, {PropTypes} from 'react';
import { Form, Input } from 'antd';


export default class TitleDescriptionForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { getFieldProps } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <Form horizontal>
                <FormItem {...formItemLayout}  label="MR名称" >
                    <Input placeholder="title" {...getFieldProps('title',{rules:[{ required:true,message:'MR名称不能为空'}]})} />
                </FormItem>
                <FormItem {...formItemLayout} label="MR描述" >
                    <Input type="textarea" placeholder="description" rows="5" {...getFieldProps('description',{rules:[{required:true,message:'不能为空'}]})} />
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(TitleDescriptionForm)