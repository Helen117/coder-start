/**
 * Created by william.xu on 2016/12/30
 */

import React, {PropTypes} from 'react';
import {Form, Input, Button, Select, Row, Col, Icon, Tooltip} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;

class DeployConfig extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        const {getFieldDecorator, getFieldError, getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 20},
        };
        const formItemLayout2 = {
            labelCol: {span: 6},
            wrapperCol: {span: 16},
        };

        return (
            <div>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout2} label="目标服务器">
                            {getFieldDecorator('server', {
                                rules: [
                                    { required: true, message: '请选择发布的目标服务器!' },
                                ],
                            })(
                                <Select placeholder="请选择发布的目标服务器">
                                    <Option value="root@10.10.147.189">root@10.10.147.189</Option>
                                    <Option value="root@10.10.147.190">root@10.10.147.190</Option>
                                </Select>
                            )}
                            {/*<Row>*/}
                                {/*<Col span={18}>*/}
                                    {/*{getFieldDecorator('targetServer', {*/}
                                        {/*rules: [*/}
                                            {/*{ required: true, message: '请选择发布的目标服务器!' },*/}
                                        {/*],*/}
                                    {/*})(*/}
                                        {/*<Select placeholder="请选择发布的目标服务器">*/}
                                            {/*<Option value="server1">root@10.10.147.189</Option>*/}
                                            {/*<Option value="server2">root@10.10.147.190</Option>*/}
                                        {/*</Select>*/}
                                    {/*)}*/}
                                {/*</Col>*/}
                                {/*<Col span={4}>*/}
                                    {/*<Button style={{marginLeft:0}} type="ghost" icon="edit">编辑</Button>*/}
                                {/*</Col>*/}
                            {/*</Row>*/}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout2} label={<span>
                            发布的文件&nbsp;
                            <Tooltip title={<div>
                                <p>支持通配符，举例说明如下：</p>
                                <p>target 表示target目录或文件</p>
                                <p>target/test 表示target目录下test文件</p>
                                <p>target/* 表示target目录下所有文件</p>
                                <p>target/**/*.txt 表示target子目录下所有txt文件</p>
                            </div>}>
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>}>
                            {getFieldDecorator('sourcePath',
                                {rules:[
                                    {required:true, message:'请输入需发布的文件或目录'}
                                ]})(<Input type="text" placeholder="请输入需发布的文件或目录"/>)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout2} label="服务器目录">
                            {getFieldDecorator('targetPath',
                                {rules:[
                                    {required:true, message:'请输入发布到目标服务器的目录'}
                                ]})(<Input type="text" placeholder="请输入发布到目标服务器的目录"/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label={<span>
                            执行的脚本
                        </span>}>
                            {getFieldDecorator('execCommand',
                                {rules:[
                                    {required:true, message:'请输入在目标服务器上执行的脚本'}
                                ]})(<Input type="textarea" rows={3} placeholder="请输入在目标服务器上执行的脚本"/>)}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );

    }


}

export default DeployConfig = Form.create({
    withRef:true,
    // onFieldsChange(props, changedFields) {
    //     console.log('onFieldsChange', props, changedFields);
    // },
    // mapPropsToFields(props) {
    //     console.log('mapPropsToFields', props);
    // }
})(DeployConfig);