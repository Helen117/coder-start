/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/20
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification} from 'antd';
import Box from '../../components/Box';
import {createProject} from './actions/create-project-action';

const confirm = Modal.confirm;
const FormItem = Form.Item;

class ProjectDetail extends React.Component {
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
                actions.createProject(formData);
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

    componentWillMount() {
    }
    componentDidMount() {
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
            <Box title={editType == 'add' ? '新建项目' : '修改项目'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="项目名称">
                        <Input type="text" {...getFieldProps('name', {initialValue: '', rules:[{ required:true}]})} placeholder="请输入项目名称"/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="项目路径">
                        <Input type="text" {...getFieldProps('path ', {initialValue: '', rules:[{ required:true}]})} placeholder="请输入项目路径"/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        <Input type="textarea" {...getFieldProps('description', {initialValue: ''})} />
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

ProjectDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


ProjectDetail = Form.create()(ProjectDetail);

function mapStateToProps(state) {
    return {
        inserted: state.createProject.result
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createProject}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
