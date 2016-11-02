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
import {Form, Input, Button, Modal, notification,Menu, Icon, Radio, Select} from 'antd';
import Box from '../../components/box';
import {createProject} from './actions/create-project-action';
import 'pubsub-js';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            selectGroupId:null,
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form, loginInfo } = this.props;
        const {editType} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                var data={
                    username:'',
                    name:'',
                    description:'',
                };
                data.username=loginInfo.username;
                data.userId = loginInfo.userId;
                data.name = formData.name;
                data.description = formData.description;
                data.groupId = this.state.selectGroupId;
                data.visibility_level = formData.visibility_level;
                if(editType == 'add'){
                    actions.createProject(data);
                }else{
                    //调修改项目的接口
                }
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
        PubSub.publish("evtRefreshGroupTree",{});
        this.context.router.goBack();
    }

    errCallback(errMessage){
        notification.error({
            message: '创建失败',
            description:errMessage,
            duration: 4
        });
    }

    componentWillReceiveProps(nextProps) {
        const { result, errMessage } = nextProps;
        if (this.props.result != result && result){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }
    }

    componentWillMount() {
    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    componentDidMount() {
        const {selectedRow, } = this.props.location.state;
        const {setFieldsValue} = this.props.form;
        const {getGroupInfo} = this.props;
        if (selectedRow){
            for(let i=0; i<getGroupInfo.children.length; i++){
                if(selectedRow.projectName == getGroupInfo.children[i].name){
                    setFieldsValue({
                        name:getGroupInfo.children[i].name,
                        description:getGroupInfo.children[i].description,
                        groupid:getGroupInfo.id,
                        visibility_level:getGroupInfo.children[i].visibility_level.toString()
                    });
                }
            }
        }
        if(!this.isEmptyObject(getGroupInfo)){
            setFieldsValue({groupid:getGroupInfo.name});
            this.setState({
                selectGroupId:getGroupInfo.id
            });
        }
    }

    projectNameExists(rule, value, callback){
        const {list} = this.props;
        if(!value){
            callback();
        }else{
            var count=0;
            for(var i=0;i<list.length;i++){
                for(var j=0;j<list[i].children.length;j++){
                    var project_cat = list[i].children[j];
                    for(var k=0; k<project_cat.children.length; k++){
                        if(value == project_cat.children[k].name){
                            count++;
                        }
                    }
                }
            }
            if(count != 0){
                callback([new Error('项目名称已被占用')]);
            }else {
                callback();
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
        const {list} = this.props;
        if(list.length > 0){
            const options = list[list.length-1].children.map( (item)=>{
                return <Option value={item.id} key={item.id}>{item.name}</Option>
            } )

            const nameProps = getFieldProps('name',
                {rules:[
                    { required:true, message:'请输入项目名称!'},
                    {validator:this.projectNameExists.bind(this)},
                ]
                });
            const descriptionProps = getFieldProps('description',);
            const groupProps = getFieldProps('groupid',{rules:[{ required:true}]});
            const visibilityProps = getFieldProps('visibility_level',
                {rules:[
                    {required:true, message:'请选择可见级别！'}
                ]});

            return (
                <Box title={editType == 'add' ? '新建项目' : '修改项目'}>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="项目名称">
                            <Input type="text" {...nameProps} placeholder="请输入项目名称"/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述">
                            <Input type="textarea" {...descriptionProps} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="项目所在组">
                            <Select
                                showSearch
                                disabled={editType=='add' ? true : false}
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                notFoundContent=""
                                {...groupProps}
                            >
                                {options}
                            </Select>
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

ProjectDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


ProjectDetail = Form.create()(ProjectDetail);

function mapStateToProps(state) {
    return {
        result: state.createProject.result,
        errMessage:state.createProject.errors,
        loginInfo:state.login.profile,
        list: state.getGroupTree.treeData,
        loading:state.createProject.loading,
        disabled:state.createProject.disabled,
        getGroupInfo:state.getGroupInfo.groupInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createProject}, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
