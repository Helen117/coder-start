/**
 * Created by zhaojp on 2016/9/20.
 */
import React, {PropTypes} from 'react';
import { DatePicker, Button, Form, Input, Col} from 'antd';
import Box from '../../components/Box';

const createForm = Form.create;
const FormItem = Form.Item;

class InputPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { getFieldProps } = this.props.form;
        const endDateProps =getFieldProps('endDate', {
            rules: [
                { required: true, whitespace: true, type: 'date'},
            ],
        })
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };

        return (
            <Box title="创建里程碑">
                <Form horizontal >
                    <FormItem   {...formItemLayout} label="名称">
                        <Input {...getFieldProps('title')} placeholder="请输入名称" />
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注" >
                        <Input type="textarea" placeholder="请输入描述信息" {...getFieldProps('description')} />
                    </FormItem>
                    <FormItem
                        label="日期"
                        labelCol={{ span: 7 }}
                        required
                    >
                        <Col span="4">
                            <FormItem>
                                <DatePicker {...getFieldProps('startDate')}/>
                            </FormItem>
                        </Col>
                        <Col span="1">
                            <p className="ant-form-split" >-</p>
                        </Col>
                        <Col span="6">
                            <FormItem>
                                <DatePicker {...endDateProps} />
                            </FormItem>
                        </Col>
                    </FormItem>
                </Form>
            </Box>

        )
    }
}

export default (createForm()(InputPage))