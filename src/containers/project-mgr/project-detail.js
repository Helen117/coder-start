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
import Box from '../../components/box';
import {createProject} from './actions/create-project-action';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class ProjectDetail extends React.Component {
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
                console.log("loginInfo:",loginInfo);
                var data={
                    username:'',
                    gitlabProject:{
                        name:'',
                        description:'',
                    }
                };
                data.username=loginInfo.username;
                data.gitlabProject.name = formData.name;
                data.gitlabProject.description = formData.description;
                actions.createProject(data);
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

    projectNameExists(rule, value, callback){
        const {list} = this.props;
        if(!value){
            callback();
        }else{
            var count=0;
            for(var i=0;i<list.length;i++){
                for(var j=0;j<list[i].children.length;j++){
                    if(value == list[i].children[j].gitlabProject.name){
                        count++;
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
        const nameProps = getFieldProps('name',
            {rules:[
                { required:true},
                {validator:this.projectNameExists.bind(this)},
                ]
            });
        //const pathProps = getFieldProps('path',{rules:[{ required:true}]});
        const descriptionProps = getFieldProps('description',);
        //const visibilityProps = getFieldProps('visibility_level',);

        return (
            <Box title={editType == 'add' ? '新建项目' : '修改项目'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="项目名称">
                        <Input type="text" {...nameProps} placeholder="请输入项目名称"/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        <Input type="textarea" {...descriptionProps} />
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
        inserted: state.createProject.result,
        loginInfo:state.login.profile,
        list: state.projectList.projectList,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createProject}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
