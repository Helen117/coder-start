/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, message, Modal, Input, Form} from 'antd';
import TreeFilter from '../../components/tree-filter';
import {getUserRelationTree} from './actions/user-relation-tree-action';
import {getSelectNode} from './actions/select-node-action';
import PopoverImg from '../../components/popover-img';
import 'pubsub-js';
import {findUserGroupById} from './utils';
import {setUserGroupDelete} from './actions/user-group-detail-action';

const FormItem = Form.Item;

class UserRelation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalVisible:false
        }
    }

    componentDidMount(){
        const {userTreeData, selectedNode} = this.props;
        PubSub.subscribe("evtRefreshUserGroupTree",()=>this.props.getUserRelationTree());
        let add_member="",projectId=""
        if(this.props.location.state){
            add_member = this.props.location.state.addMember;
            projectId = this.props.location.state.projectId;
        }
        if(userTreeData.length == 0){
            this.props.getUserRelationTree();
        }
        if(selectedNode){
            this.context.router.push({
                pathname: '/userRelation/userInfo',
                state:{addMember:add_member,projectId:projectId,node:selectedNode}
            });
        }
    }

    onSelectNode(node){
        //根据node.id找到点击的节点的组织的信息
        const {userTreeData} = this.props;
        let selectedGroup = findUserGroupById(node.id,userTreeData)
        this.props.getSelectNode(node.id,selectedGroup);
        let add_member="",projectId=""
        if(this.props.location.state){
            add_member = this.props.location.state.addMember;
            projectId = this.props.location.state.projectId;
        }
        this.context.router.push({
            pathname: '/userRelation/userInfo',
            state:{addMember:add_member,projectId:projectId,node:node}
        });
    }

    handleOk() {
        const { form,setUserGroupDelete,selectedUserGroup,loginInfo } = this.props;
        /*const formData = form.getFieldsValue();
        console.log("formData:",formData)*/
        //调删除组织接口
        setUserGroupDelete(selectedUserGroup.id,loginInfo.userId)
    }

    handleCancel() {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            modalVisible: false,
        });
    }

    deleteUserGroup(selectedUserGroup){//删除组织
        const {userInfoData} = this.props;
        if(selectedUserGroup){
            if(selectedUserGroup.children.length == 0 && userInfoData.length == 0){
                this.setState({
                    modalVisible: true,
                });
            }else{
                message.error('组织不为空，不能删除!',3);
            }
        }else{
            message.error('请选择需要删除的组织！',3);
        }
    }

    editUserGroup(type,selectedRow){//新增、修改组织
        const {selectedUserGroup} = this.props;
        if(!selectedUserGroup && !type){
            message.error('请选择要修改的组织!',3);
        }else{
            this.context.router.push({
                pathname: '/userGroupDetail',
                state: {editType: type, selectedRow}
            });
        }
    }

    editUser(type,selectedRow){//新增人员
        const {selectedUserGroup} = this.props;
        if(!selectedUserGroup){
            message.error('请选择人员所在组织!',3);
        }else{
            this.context.router.push({
                pathname: '/userAddModify',
                state: {editType: type, selectedRow}
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {deleteResult, deleteErrors} = nextProps;
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                modalVisible: false,
            });
            this.insertCallback('删除成功!');
        }else if(this.props.deleteErrors != deleteErrors && deleteErrors){
            this.errCallback('删除失败!',deleteErrors);
        }
    }

    render(){
        const {userTreeData, loading, selectedNode, selectedUserGroup} = this.props;
        const {getFieldProps} = this.props.form;
        const content = (
            <div>
                <a style={{paddingLeft:10}}
                   onClick={this.editUserGroup.bind(this, 'add', null)}>新建组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editUserGroup.bind(this, null, selectedUserGroup)}>修改组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.deleteUserGroup.bind(this, selectedUserGroup)}>删除组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editUser.bind(this, 'add', null)}>新增人员</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editUser.bind(this, null, null)}>删除人员</a>
            </div>
        );
        /*const deleteResultProps = getFieldProps('delete_result',
            {rules:[
                {required:true, message:'请输入删除原因！'}
            ]});*/

        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loading}
                        notFoundMsg='找不到项目'
                        inputPlaceholder="快速查询项目"
                        loadingMsg="正在加载项目信息..."
                        nodesData={userTreeData}
                        defaultSelectedKeys={[selectedNode]}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    <Row>
                        <PopoverImg content={content}/>
                        <Modal title="确认删除此组织吗?"
                               visible={this.state.modalVisible}
                               onOk={this.handleOk.bind(this)}
                               onCancel={this.handleCancel.bind(this)}
                        >
                            <p>{selectedUserGroup?selectedUserGroup.name:""}</p>
                            {/*<p>如果确认此操作，请在下框输入原因：</p>
                            <FormItem>
                                <Input type="textarea" {...deleteResultProps} rows={4} />
                            </FormItem>*/}
                        </Modal>
                    </Row>
                    <Row>
                        {this.props.children}
                    </Row>
                </Col>
            </Row>
        )
    }
}

UserRelation.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

UserRelation = Form.create()(UserRelation);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        loading : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
        userInfoData:state.getUserInfo.userInfoData,
        selectedNode: state.getSelectNode.selectedNode,
        selectedUserGroup: state.getSelectNode.selectedUserGroup,
        deleteResult: state.createUserGroup.deleteResult,
        deleteErrors:state.createUserGroup.errors,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserRelationTree:bindActionCreators(getUserRelationTree, dispatch),
        getSelectNode:bindActionCreators(getSelectNode, dispatch),
        setUserGroupDelete:bindActionCreators(setUserGroupDelete, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRelation);