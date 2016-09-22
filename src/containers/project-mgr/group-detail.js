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
import Box from '../../components/Box';
import {createGroup} from './actions/create-group-action';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form, loginInfo } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                console.log('收到表单值：', formData);
                formData.owner=loginInfo.userName;
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
            duration: 1
        });
        this.context.router.goBack();
    }

    componentWillReceiveProps(nextProps) {
        const { inserted } = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
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
        if(!value){
            callback();
        }else{

        }
    }


    render() {
        const {editType} = this.props.location.state;
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const nameProps = getFieldProps('name',
            {rules:[
                {required:true},
                {validator:this.groupNameExists},
            ]});
        const pathProps = getFieldProps('path',{rules:[{ required:true}]});
        const descriptionProps = getFieldProps('description',);
        const visibilityProps = getFieldProps('visibility_level',);

        return (
            <Box title={editType == 'add' ? '新建项目组' : '修改项目组'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="项目组名称">
                        <Input type="text" {...nameProps} placeholder="请输入项目名称"/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="项目组路径">
                        <Input type="text" {...pathProps} placeholder="请输入项目路径"/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        <Input type="textarea" {...descriptionProps} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="可见级别">
                        <RadioGroup {...visibilityProps}>
                            <Radio value="Private">Private</Radio>
                            <Radio value="Intenal">Intenal</Radio>
                            <Radio value="Public">Public</Radio>
                        </RadioGroup>
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

GroupDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


GroupDetail = Form.create()(GroupDetail);

function mapStateToProps(state) {
    return {
        inserted: state.createGroup.result,
        loginInfo:state.login.profile,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createGroup}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);