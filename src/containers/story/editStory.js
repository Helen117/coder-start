/**
 * Created by zhaojp on 2017/3/30.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Form,Input,Select,Button } from 'antd';
import {getTask,getStory} from './action'
import './index.less';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
class EditStory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: []
        }
    }

    handleCancel() {
        const {form} = this.props;
        const {router} = this.context;
        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                //router.goBack();
                form.resetFields();
            },
            onCancel() {
                //do nothing
            }
        })
    }

    handleSubmit(e) {
        const {loginInfo} = this.props;
        const {form} = this.props;
        console.log('handleSubmit')

        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.creater = loginInfo.username;
                console.log('提交表单',data)
            }
        })

    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return(
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                <FormItem {...formItemLayout}  label="名称" >
                    {getFieldDecorator('title')(<Input placeholder="请输入名称" />)}
                </FormItem>

                <FormItem {...formItemLayout}  label="描述" >
                    {getFieldDecorator('description')(<Input type="textarea" rows={4} placeholder="请输入描述" />)}
                </FormItem>

                <FormItem {...formItemLayout}  label="检查项" >
                    {getFieldDecorator('check_items')(<Input type="textarea" rows={4} placeholder="请输入检查项" />)}
                </FormItem>

                <FormItem {...formItemLayout}  label="测试人员" >
                    {getFieldDecorator('tester')( <Select
                 multiple
                 style={{ width: '100%' }}
                 placeholder="请选择测试人员"
                 >
                        <Option key={1}>bips</Option>
                 </Select>)}
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" loading={this.props.createLoading}>确定</Button>
                    <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                </FormItem>
            </Form>
        )
    }
}

function mapStateToProps(state) {
    return {

        //jointTaskData : state.story.jointTaskData,
        getTaskLoading : state.story.getTaskLoading,
        getStoryLoading : state.story.getStoryLoading,
        stories : state.story.story,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch){
    return{
        action : bindActionCreators({getStory,getTask},dispatch),
    }
}

export default (createForm()(EditStory));