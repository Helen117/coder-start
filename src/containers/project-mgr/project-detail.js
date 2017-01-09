/**
 * Created by william.xu on 2016/9/20
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification,Menu, Icon, Radio, Select} from 'antd';
import Box from '../../components/box';
import {createProject, UpdateProject, DeleteProject} from './actions/create-project-action';
import 'pubsub-js';
import {findProjectIdByProjectName, resetGroupInfoState,searchGroupByGroupId} from '../project-list/util';
import {getGroupInfo} from './actions/create-group-action';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            selectGroupId:null,
            resetGroupInfo:null,
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form, loginInfo, projectGroup } = this.props;
        const {selectedRow } = this.props.location.state;
        const {editType} = this.props.location.state;
        const groupInfo = projectGroup.getGroupInfo?projectGroup.getGroupInfo.groupInfo:{};
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                var data={
                    username:'',
                    name:'',
                    description:'',
                    id:''
                };
                data.username=loginInfo.username;
                data.userId = loginInfo.userId;
                data.name = formData.name;
                data.description = formData.description;
                if(this.state.selectGroupId.indexOf('_') < 0){
                    data.groupId = this.state.selectGroupId;
                }
                data.visibility_level = formData.visibility_level;
                if(editType == 'add'){
                    //调创建项目的接口
                    actions.createProject(data);
                }else{
                    //调修改项目的接口
                    let projectId = findProjectIdByProjectName(selectedRow.projectName,groupInfo);
                    projectId = projectId.substr(0,projectId.length-2);
                    data.id = projectId;
                    actions.UpdateProject(data);
                    this.state.resetGroupInfo = data;
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
                //取消
            }
        })
    }

    insertCallback(message){
        notification.success({
            message: message,
            description: '',
            duration: 2
        });
        PubSub.publish("evtRefreshGroupTree",{});
    }

    componentWillReceiveProps(nextProps) {
        const { project,list } = nextProps;
        const {projectGroup} = this.props;
        const groupInfo = projectGroup.getGroupInfo?projectGroup.getGroupInfo.groupInfo:{};
        const node = projectGroup.getGroupInfo?projectGroup.getGroupInfo.node:'';
        const {editType} = this.props.location.state;
        //创建返回信息
        if(this.props.project.createProject && project.createProject){
            if(this.props.project.createProject.result != project.createProject.result
            && project.createProject.result){
                this.insertCallback("创建成功");
            }
        }
        //更新返回信息
        if(this.props.project.updateProject && project.updateProject){
            if(this.props.project.updateProject.result != project.updateProject.result
                && project.updateProject.result){
                this.insertCallback("修改成功");
            }
        }
        //更新选择项目组信息
        if (this.props.list != list && list.length>0){
            const groupId = groupInfo.id;
            if(editType != 'add'){
                const resetGroupInfo = resetGroupInfoState(groupInfo,this.state.resetGroupInfo);
                this.props.getGroupInfo(resetGroupInfo, groupId,node);
            }else{
                const resetGroupInfo = searchGroupByGroupId(groupId,list);
                this.props.getGroupInfo(resetGroupInfo, groupId,node);
            }
            this.context.router.goBack();
        }
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
        const {projectGroup} = this.props;
        const groupInfo = projectGroup.getGroupInfo?projectGroup.getGroupInfo.groupInfo:{};
        if (selectedRow){
            for(let i=0; i<groupInfo.children.length; i++){
                if(selectedRow.projectName == groupInfo.children[i].name){
                    setFieldsValue({
                        name:groupInfo.children[i].name,
                        description:groupInfo.children[i].description,
                        groupid:groupInfo.id,
                        visibility_level:groupInfo.children[i].visibility_level.toString()
                    });
                }
            }
        }
        if(!this.isEmptyObject(groupInfo)){
            setFieldsValue({groupid:groupInfo.name});
            this.setState({
                selectGroupId:groupInfo.id
            });
        }
    }

    render() {
        const {editType} = this.props.location.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const {list,project} = this.props;
        if(list){
            let options = (<Option value="1"></Option>);
            if(list.length > 0){
                options = list[list.length-1].children.map( (item)=>{
                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                } )
            }

            const nameProps = getFieldDecorator('name',
                {rules:[
                    { required:true, message:'请输入项目名称!'},
                ]
                })(<Input type="text" placeholder="请输入项目名称"/>);
            const descriptionProps = getFieldDecorator('description',{rules:[{ required:true,message:'请输入描述！'}]})(<Input type="textarea" />);
            const groupProps = getFieldDecorator('groupid',{rules:[{ required:true}]})(
                <Select
                    showSearch
                    disabled={editType=='add' ? true : false}
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    notFoundContent=""
                >
                    {options}
                </Select>
            );
            const visibilityProps = getFieldDecorator('visibility_level',
                {rules:[
                    {required:true, message:'请选择可见级别！'}
                ]})(
                <RadioGroup>
                    <Radio value="0">仅对自己可见</Radio>
                    <Radio value="20">所有人可见</Radio>
                </RadioGroup>
            );
            const modifyResultProps = getFieldDecorator('modify_result',
                {rules:[
                    {required:editType == 'add'?false:true, message:'请输入修改原因！'}
                ]})(<Input type="textarea" rows={4} />);

            const addLoading = project.createProject?project.createProject.loading:false;
            const addDisabled = project.createProject?project.createProject.disabled:false;
            const updateLoading = project.updateProject?project.updateProject.loading:false;
            const updateDisabled = project.updateProject?project.updateProject.disabled:false;

            return (
                <Box title={editType == 'add' ? '新建项目' : '修改项目'}>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="项目名称">
                            {nameProps}
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述">
                            {descriptionProps}
                        </FormItem>
                        {editType == 'add' ? (
                            <FormItem {...formItemLayout} label="项目所在组">
                                {groupProps}
                            </FormItem>
                        ) : (<div></div>)}
                        <FormItem {...formItemLayout} label="可见级别">
                            {visibilityProps}
                        </FormItem>
                        {editType == 'add' ? (<div></div>) : (
                            <FormItem {...formItemLayout} label="修改原因">
                                {modifyResultProps}
                            </FormItem>
                        )}
                        <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit"
                                    loading={editType == 'add'?addLoading:updateLoading}
                                    disabled={editType == 'add'?addDisabled:updateDisabled}>
                                确定</Button>
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
        loginInfo:state.login.profile,
        list: state.getGroupTree.treeData,
        project:state.project,
        projectGroup:state.projectGroup,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createProject, UpdateProject, DeleteProject}, dispatch),
        getGroupInfo:bindActionCreators(getGroupInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
