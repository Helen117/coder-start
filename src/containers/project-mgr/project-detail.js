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
import {Form, Input, Button, Modal, notification,Menu, Dropdown, Icon} from 'antd';
import Box from '../../components/box';
import {createProject} from './actions/create-project-action';

const confirm = Modal.confirm;
const FormItem = Form.Item;

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
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                console.log('收到表单值：', formData);
                var data={
                    username:'',
                    gitlabProject:{
                        name:'',
                        description:'',
                    }
                };
                data.username=loginInfo.username;
                data.userId = loginInfo.userId;
                data.gitlabProject.name = formData.name;
                data.gitlabProject.description = formData.description;
                data.groupId = this.state.selectGroupId;
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

    errCallback(){
        notification.error({
            message: '创建失败',
            description: '项目名称已被占用!',
            //description:{errMessage},
            duration: 1
        });
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage } = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback();
        }
    }

    componentWillMount() {
    }
    componentDidMount() {
        const {selectedRow, } = this.props.location.state;
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

    handleMenuClick(e){
        console.log('click left button', e);
        const {setFieldsValue} = this.props.form;
        const {getMyGroup} = this.props;
        for(var i=0;i<getMyGroup.myGroup.length;i++){
            if(e.key == getMyGroup.myGroup[i].id){
               const groupName = getMyGroup.myGroup[i].name;
               setFieldsValue({groupid:groupName});
                this.setState({
                    selectGroupId:getMyGroup.myGroup[i].id
                });
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
                { required:true, message:'请输入项目名称!'},
                {validator:this.projectNameExists.bind(this)},
                ]
            });
        const descriptionProps = getFieldProps('description',);
        const groupProps = getFieldProps('groupid',{rules:[{ required:true}]});

        const {getMyGroup} = this.props;
        if(getMyGroup && (getMyGroup.fetchStatue || false)){
            const loop = (data) => data.map((item) => {
                return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
            });
            const nodes = loop(getMyGroup.myGroup);
            const menu = (
                <Menu onClick={this.handleMenuClick.bind(this)}>
                    {nodes}
                </Menu>
            );

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
                            <Dropdown overlay={menu}>
                                <Input {...groupProps} style={{ marginLeft: 8 }} placeholder="请选择项目组" icon="down"/>
                            </Dropdown>
                        </FormItem>
                        <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading} disabled={this.props.disabled}>确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>
            );
        }else {return null;}
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
        errMessage:state.createProject.errors,
        loginInfo:state.login.profile,
        list: state.projectList.projectList,
        loading:state.createProject.loading,
        disabled:state.createProject.disabled,
        getMyGroup:state.getMyGroup,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createProject}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
