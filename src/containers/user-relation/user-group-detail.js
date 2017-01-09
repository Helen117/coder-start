/**
 * Created by Administrator on 2016-11-08.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification,Select} from 'antd';
import Box from '../../components/box';
import 'pubsub-js';
import {findUserGroupById} from './utils';
import {createUserGroup, UpdateUserGroup,getUserLeader,getUserInfo} from './actions/user-relation-actions';

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
        const { form, actions, loginInfo,selectNode } = this.props;
        const selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';
        const {editType} = this.props.location.state;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                const data = {};
                data.name = formData.name;
                data.description = formData.description;
                data.owner_id = loginInfo.userId;
                data.reason = formData.reason;
                data.parent_id = this.state.selectedUserGroup;
                data.leader_id = parseInt(formData.leader_id);
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
        PubSub.publish("evtRefreshUserGroupTree",{});
        const {selectNode} = this.props;
        const busiType = 'user-relation';
        const selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';
        this.props.getGroupsUsers(selectedUserGroup.id,busiType);
        this.context.router.goBack();
    }

    findLeaderName(leaderId){
        const {leaderInfo} = this.props;
        if(leaderInfo){
            for(let i=0;i<leaderInfo.length; i++){
                if(leaderId == leaderInfo[i].leader_id){
                    return leaderInfo[i].leader_name;
                }
            }
        }
        return '';
    }

    componentWillMount() {
        this.props.getNotLeader();
        const {userRelationTree,selectNode} = this.props;
        const userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];
        const selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';

        const {editType} = this.props.location.state;
        const {setFieldsValue} = this.props.form;
        if(selectedUserGroup){
            this.setState({
                selectedUserGroup:selectedUserGroup.id,
            })
            if(editType == 'add'){
                setFieldsValue({parent_id:selectedUserGroup.name});
            }else{
                const parentGroup = findUserGroupById(selectedUserGroup.parent_id, userTreeData);
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
        const {createGroupInfo,updateGroupInfo} = nextProps;
        //创建返回信息
        if(this.props.createGroupInfo && createGroupInfo){
            if (this.props.createGroupInfo.result != createGroupInfo.result
                && createGroupInfo.result) {
                this.insertCallback("创建成功");
            }
        }
        //修改返回信息
        if(this.props.updateGroupInfo && updateGroupInfo){
            if (this.props.updateGroupInfo.updateResult != updateGroupInfo.updateResult
                && updateGroupInfo.updateResult) {
                this.insertCallback("修改成功");
            }
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

    render() {
        const {editType} = this.props.location.state;
        const {getFieldDecorator} = this.props.form;
        const {createGroupInfo,updateGroupInfo,notLeaderInfo} = this.props;
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

        const leader = notLeaderInfo?(notLeaderInfo.notLeaderInfo?notLeaderInfo.notLeaderInfo.map(
            data => <Option key={data.leader_id}>{data.leader_name}</Option>):[]):[];
        const createLoading = createGroupInfo?createGroupInfo.loading:false;
        const updateLoading = updateGroupInfo?updateGroupInfo.updateLoading:false;
        const createDisabled = createGroupInfo?createGroupInfo.disabled:false;
        const updateDisabled = updateGroupInfo?updateGroupInfo.updateDisabled:false;

        return(
            <Box title={editType == 'add' ? '新建组织' : '修改组织'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="组织名称">
                        {nameProps}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {descriptionProps}
                    </FormItem>
                    <FormItem {...formItemLayout}  label="领导"
                        help="如果要将此组织的领导设为组织B的领导，请先修改组织B的领导！">
                        {getFieldDecorator('leader_id')(
                            <Select showSearch
                                    showArrow={false}
                                    placeholder="leader"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    allowClear>
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
                                loading={editType == 'add'?createLoading:updateLoading}
                                disabled={editType == 'add'?createDisabled:updateDisabled}>
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
        userRelationTree:state.UserRelation.getUserRelationTree,
        selectNode:state.UserRelation.getSelectNode,
        createGroupInfo:state.UserRelation.createUserGroup,
        updateGroupInfo:state.UserRelation.updateUserGroup,
        notLeaderInfo:state.UserRelation.notLeaderInfo,
        leaderInfo:state.register.leader,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createUserGroup, UpdateUserGroup}, dispatch),
        getNotLeader:bindActionCreators(getUserLeader, dispatch),
        getGroupsUsers:bindActionCreators(getUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupDetail);