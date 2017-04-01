/**
 * Created by zhaojp on 2017/3/30.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Form,Input,Select,Button,Modal,  } from 'antd';
import {addStory,updateStory,getStory} from './action'
import './index.less';

const confirm = Modal.confirm;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
class EditStory extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps){
        const {setFieldsValue} = this.props.form;
        const {story,editType,addStory,updateStory} = nextProps;
        if(story && editType=='update' && !this.props.visible){
            setFieldsValue(story);
        }
        if(addStory && addStory!= this.props.addStory || updateStory && updateStory!= this.props.updateStory){
            this.props.actions.getStory(this.props.milestoneId);
        }
    }

    handleCancel() {
        const {form,story} = this.props;
        const setVisible = this.props.setVisible;
        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                form.resetFields();
                setVisible(false,story);
            },
            onCancel() {
                //do nothing
            }
        })
    }

    handleSubmit(e) {
        const {form,story,editType,loginInfo,milestoneId} = this.props;
        const setVisible = this.props.setVisible;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.creater = {"name": loginInfo.username,"id":loginInfo.userId};
                if(editType=='add'){
                    data.milestone_id = milestoneId;
                    this.props.actions.addStory(data);
                }else{
                    data.id = story.id;
                    this.props.actions.updateStory(data);
                }
                setVisible(false,story);
                form.resetFields();
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
        <Modal title={this.props.editType=='add'?'添加故事':'修改故事'} visible={this.props.visible}
               onOk={this.handleSubmit.bind(this)}  onCancel={this.handleCancel.bind(this)}
        >
            <Form horizontal >

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
                    {getFieldDecorator('testers')( <Select
                        multiple
                        style={{ width: '100%' }}
                        placeholder="请选择测试人员"
                    >
                        <Option key={1}>bips</Option>
                    </Select>)}
                </FormItem>
            </Form>
        </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {

        //jointTaskData : state.story.jointTaskData,
        addStory: state.story.getStoryLoading,
        updateStory: state.story.updateStoryLoading,
        getStoryLoading : state.story.getStoryLoading,
        stories : state.story.story,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({addStory,updateStory,getStory},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(EditStory));