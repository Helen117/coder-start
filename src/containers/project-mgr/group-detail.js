/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification,Radio} from 'antd';
import Box from '../../components/box';
import {createGroup} from './actions/create-group-action';
import 'pubsub-js';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            reveiveGroup:null,
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form, loginInfo } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                formData.owner=loginInfo.username;
                formData.userId = loginInfo.userId;
                actions.createGroup(formData);
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

    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '',
            duration: 2
        });
        PubSub.publish("evtRefreshGroupTree",{});
        this.context.router.goBack();
    }

    errCallback(message){
        notification.error({
            message: '创建失败',
            description:message,
            duration: 4
        });
    }

    componentWillReceiveProps(nextProps) {
        const {result, errMessage} = nextProps;
        if (this.props.result != result && result) {
            this.insertCallback();
        } else if (this.props.errMessage != errMessage && errMessage) {
            this.errCallback(errMessage);
        }
    }

    componentDidMount() {
        const {selectedRow} = this.props.location.state;
        if (selectedRow){
            const {setFieldsValue} = this.props.form;
            setFieldsValue(selectedRow);
        }
    }

    groupNameExists(rule, value, callback){
        const {list} = this.props;
        if(!value){
            callback();
        }else{
            var count = 0;
            for(var i=0;i<list.length;i++){
                for(var j=0; j<list[i].children.length; j++){
                    if(value == list[i].children[j].name){
                        count++;
                    }
                }
            }
            if(count != 0){
                callback([new Error('项目组名称已被占用')]);
            }else {
                callback();
            }
        }
    }


    render() {
        const {editType} = this.props.location.state;
        const {getFieldProps, getFieldError} = this.props.form;
        const {list} = this.props;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        if(list){
            const nameProps = getFieldProps('name',
                {rules:[
                    {required:true, message:'请输入项目组名称！'},
                    //{validator:this.groupNameExists.bind(this)},
                ]});
            const descriptionProps = getFieldProps('description',);
            const visibilityProps = getFieldProps('visibility_level',);

            return (
                <Box title={editType == 'add' ? '新建项目组' : '修改项目组'}>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="项目组名称">
                            <Input type="text" {...nameProps} placeholder="请输入项目名称"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述">
                            <Input type="textarea" {...descriptionProps} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="可见级别">
                            <RadioGroup {...visibilityProps}>
                                <Radio value="0">仅对自己可见</Radio>
                                <Radio value="20">所有人可见</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading} disabled={this.props.disabled}>确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>
            );
        }
        return null;
    }
}

GroupDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


GroupDetail = Form.create()(GroupDetail);

function mapStateToProps(state) {
    return {
        result: state.createGroup.result,
        errMessage:state.createGroup.errors,
        loginInfo:state.login.profile,
        list: state.getGroupTree.treeData,
        loading:state.createGroup.loading,
        disabled:state.createGroup.disabled,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createGroup}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);