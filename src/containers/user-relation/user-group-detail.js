/**
 * Created by Administrator on 2016-11-08.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification, Icon, Row, Col,Select} from 'antd';
import Box from '../../components/box';
import MoreUserGroup from '../../components/more-user-group';
import 'pubsub-js';
import styles from './index.css';
import {findUserGroupById} from './utils';
import {createUserGroup, UpdateUserGroup} from './actions/user-group-detail-action';
import {getLeader} from '../register/actions/register-action';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class UserGroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            modalVisible:false,
            selectedUserGroup:null
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form, actions, loginInfo,selectedUserGroup } = this.props;
        const {editType} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                let data = {};
                data.name = formData.name;
                data.description = formData.description;
                data.owner_id = loginInfo.userId;
                data.reason = formData.reason;
                data.parent_id = this.state.selectedUserGroup;
                data.leaderId = formData.leader_id;
                if(editType == 'add'){
                    //调创建组织的接口
                    actions.createUserGroup(data);
                }else{
                    //调修改组织的接口
                    data.id = selectedUserGroup.id;
                    data.updator_id = loginInfo.userId;
                    actions.UpdateUserGroup(data);
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

    insertCallback(message){
        notification.success({
            message: message,
            description: '',
            duration: 2
        });
        PubSub.publish("evtRefreshUserGroupTree",{});
        this.context.router.goBack();
    }

    errCallback(message,errmessage){
        notification.error({
            message: message,
            description:errmessage,
            duration: 4
        });
    }

    findLeaderName(leaderId){
        const {leaderInfo} = this.props;
        for(let i=0;i<leaderInfo.length; i++){
            if(leaderId == leaderInfo[i].leader_id){
                return leaderInfo[i].leader_name;
            }
        }
    }

    componentWillMount() {
        const {selectedUserGroup, userTreeData,actions} = this.props;
        const {editType} = this.props.location.state;
        const {setFieldsValue} = this.props.form;
        if(selectedUserGroup){
            this.setState({
                selectedUserGroup:selectedUserGroup.id,
            })
            if(editType == 'add'){
                setFieldsValue({parent_id:selectedUserGroup.name});
            }else{
                let parentGroup = findUserGroupById(selectedUserGroup.parent_id, userTreeData);
                if(parentGroup){
                    setFieldsValue({parent_id:parentGroup.name});
                }
                setFieldsValue({name:selectedUserGroup.name});
                setFieldsValue({description:selectedUserGroup.description});
                setFieldsValue({leader_id:this.findLeaderName(selectedUserGroup.leader_id)});
            }
        }else{
            this.setState({
                selectedUserGroup:0,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const {result, errMessage, updateResult, updateErrors} = nextProps;
        //创建返回信息
        if (this.props.result != result && result) {
            this.insertCallback("创建成功");
        /*} else if (this.props.errMessage != errMessage && errMessage) {
            this.errCallback("创建失败",errMessage);*/
        }
        //修改返回信息
        if (this.props.updateResult != updateResult && updateResult) {
            this.insertCallback("修改成功");
        /*} else if (this.props.updateErrors != updateErrors && updateErrors) {
            this.errCallback("修改失败",updateErrors);*/
        }
    }

    clickMoreGroup(){
        this.setState({
            modalVisible:true,
        })
    }

    handleOk(node){
        this.setState({
            modalVisible:false,
            selectedUserGroup:node.id,
        })
        if(node){
            const {setFieldsValue} = this.props.form;
            setFieldsValue({parent_id:node.name});
        }
    }

    cancelChoose(){
        this.setState({
            modalVisible:false,
        })
    }

    render() {
        const {editType} = this.props.location.state;
        const {getFieldDecorator,setFieldsValue} = this.props.form;
        const {userTreeData, loadingTree,selectedUserGroup} = this.props;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 8},
        };
        const nameProps = getFieldDecorator('name',
            {rules:[
                {required:true, message:'请输入组织名称！'},
            ]})(<Input type="text" placeholder="请输入组织名称"/>);
        const modifyResultProps = getFieldDecorator('reason',
            {rules:[
                {required:editType == 'add'?false:true, message:'请输入修改原因！'}
            ]})(<Input type="textarea" rows={4} />);
        const parentGroupProps = getFieldDecorator('parent_id',
            {rules:[
                {required:true, message:'请选择组织！'},
            ],initialValue: '0'})(<Input type="text" disabled/>);
        const descriptionProps = getFieldDecorator('description',
            {rules:[
                {required:true, message:'请输入描述！'}
            ]})(<Input type="textarea" />);
        const leader = this.props.leaderInfo?this.props.leaderInfo.map(
            data => <Option key={data.leader_id}>{data.leader_name}</Option>):[];

        return(
            <Box title={editType == 'add' ? '新建组织' : '修改组织'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="组织名称">
                        {nameProps}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {descriptionProps}
                    </FormItem>
                    <FormItem {...formItemLayout}  label="领导" >
                        {getFieldDecorator('leader_id',{rules:[{
                            required:true,message:'请选择组织领导'}]})(
                            <Select showSearch
                                    showArrow={false}
                                    placeholder="leader"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到">
                                {leader}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="父组织名称">
                        {parentGroupProps}
                    </FormItem>
                    {editType == 'add' ? (<div></div>) : (
                        <div>
                            <FormItem {...formItemLayout} label="修改原因">
                                {modifyResultProps}
                            </FormItem>
                        </div>
                    )}
                    <FormItem wrapperCol={{span: 10, offset: 10}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit"
                                loading={editType == 'add'?this.props.loading:this.props.updateLoading}
                                disabled={editType == 'add'?this.props.disabled:this.props.updateDisabled}>
                            确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
        )
    }
}

UserGroupDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UserGroupDetail = Form.create()(UserGroupDetail);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        loadingTree : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
        selectedUserGroup: state.getSelectNode.selectedUserGroup,
        result: state.createUserGroup.result,
        errMessage:state.createUserGroup.errors,
        loading:state.createUserGroup.loading,
        disabled:state.createUserGroup.disabled,
        updateResult:state.createUserGroup.updateResult,
        updateErrors:state.createUserGroup.updateErrors,
        updateLoading:state.createUserGroup.updateLoading,
        updateDisabled:state.createUserGroup.updateDisabled,
        leaderInfo:state.getLeaderInfo.leader,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createUserGroup, UpdateUserGroup,getLeader}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupDetail);