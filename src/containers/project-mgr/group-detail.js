/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, { PropTypes } from 'react';
import {Form, Input, Button, Modal,Radio} from 'antd';
import Box from '../../components/Box';
import {connect} from 'react-redux';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const RadioGroup = Radio.Group;

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:1
        }
        this.onChange = this.onChange.bind(this);
        this.nameExists = this.nameExists.bind(this);
    }

    onChange(e) {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
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
                //actions.insert(grid.url, formData)
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

    componentDidMount() {
        const {selectedRow} = this.props.location.state;
        if (selectedRow){
            const {setFieldsValue} = this.props.form;
            setFieldsValue(selectedRow);
        }
    }

    shouldComponentUpdate( nextProps, nextState ){
        return true;
    }

    nameExists(rule, value, callback){
        const {list} = this.props;
        var project =  list.projectList.project;
        if (!value) {
            callback();
        } else {
            var count = 0;
            for(var i=0;i<project.length;i++){
                if(value == project[i].project_name){
                    callback([new Error('抱歉，该用户名已被占用。')]);
                }else {
                    count++;
                }
                if(count == project.length){
                    callback();
                }
            }
        }
    }


    render() {
        const {editType} = this.props.location.state;
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const radioGroupLayout = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        const nameProps = getFieldProps('name', {
            rules:[
                { required:true,
                    min:2,
                    message: '用户名至少为 5 个字符'
                },{
                    validator:this.nameExists
                }
            ]
        });
        const pathProps = getFieldProps('path ', {
            rules:[{ required:true}]
        });
        const descProps = getFieldProps('description', {
        });

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
                        <Input type="textarea" {...descProps} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="隐私级别">
                        <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
                            <Radio style={radioGroupLayout} key="private" value={1}>Private</Radio>
                            <Radio style={radioGroupLayout} key="internal" value={2}>Internal</Radio>
                            <Radio style={radioGroupLayout} key="public" value={3}>Public</Radio>
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


function mapStateToProps(state) {
    return {
        list: state.projectList.projectList,
    }
}


export default connect(mapStateToProps)(createForm()(GroupDetail));

