/**
 * Created by helen on 2016/11/28.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin} from 'antd';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as issue from './actions/issue-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class EditBug extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentWillMount(){

    }

    componentWillReceiveProps(nextProps) {

    }

    disabledDate(current) {
        return current && current < moment();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo, projectInfo} = this.props;

        form.validateFields((errors, values) => {
            if (!!errors) {
                //message.error(errors,2);
                return;
            } else {
                const data = form.getFieldsValue();
                data.username = loginInfo.username;
// console.log('收到表单值：', data);
            }
        })
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };

        const pending = false;

        return (
            <Spin spinning={pending}>
                <Box title="新增Bug">
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout}  label="标题" >
                            {getFieldDecorator('title',{rules:[{ required:true,message:'不能为空'}]})(<Input placeholder="title"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述" >
                            {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="description" rows="5" />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="需求" >
                            {getFieldDecorator('demand',{rules:[{ required:true,message:'不能为空'}]})(
                                <Select  showSearch
                                         showArrow={false}
                                         placeholder="请选择对应的需求"
                                         optionFilterProp="children"
                                         notFoundContent="无法找到"
                                         style={{ width: 300 }} >
                                    <Option value="1">报表优化</Option>
                                    <Option value="2">IVR</Option>
                                </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="指派给" >
                            {getFieldDecorator('tester',{rules:[{ required:true,message:'不能为空'}]})(
                                <Select  showSearch
                                         showArrow={false}
                                         placeholder="请选择对应的实施人员"
                                         optionFilterProp="children"
                                         notFoundContent="无法找到"
                                         style={{ width: 300 }} >
                                    <Option value="1">孙磊</Option>
                                    <Option value="2">张军</Option>
                                </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="计划完成时间" >
                            {getFieldDecorator('due_date',{rules:[{ required:true,type:'object',message:'不能为空'}]})(<DatePicker disabledDate={this.disabledDate.bind(this)} style={{ width: 300 }}  />)}
                        </FormItem>

                        <FormItem {...formItemLayout}  label="上传" >
                            {getFieldDecorator('attachment')(
                                <Upload >
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>)}
                        </FormItem>
                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </Box>
            </Spin>
        );
    }
}

EditBug.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


EditBug = Form.create()(EditBug);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditBug);