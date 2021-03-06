/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, message, Modal, Form, notification} from 'antd';
import TreeFilter from '../../components/tree-filter';
import {getUserRelationTree} from './actions/user-relation-actions';
import {getSelectNode} from './actions/user-relation-actions';
import PopoverImg from '../../components/popover-img/popoverimg';
import 'pubsub-js';
import {findUserGroupById, isAdmin} from './utils';
import {setUserGroupDelete} from './actions/user-relation-actions';
import UserInfo from './user-info';
import {getLeader} from '../register/actions/register-action';

class UserRelation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalVisible:false,
            showUserInfo:false
        }
    }

    componentDidMount(){
        const {userRelationTree,loginInfo,treeFilterState} = this.props;
        const userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];
        const busi_type = this.props.busiType?this.props.busiType:'user-relation';
        let selectedNodeKey = [];
        if (treeFilterState[busi_type] && treeFilterState[busi_type].selectedNodeKey){
            selectedNodeKey = treeFilterState[busi_type].selectedNodeKey;
        }

        PubSub.subscribe("evtRefreshUserGroupTree",()=>this.props.getUserRelationTree(loginInfo.userId));
        if(userTreeData.length == 0){
            this.props.getUserRelationTree(loginInfo.userId);
        }
        if(selectedNodeKey.length > 0){
            this.setState({
                showUserInfo:true
            })
        }
    }

    onSelectNode(node){
        //根据node.id找到点击的节点的组织的信息
        const {userRelationTree} = this.props;
        const userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];
        const selectedGroup = findUserGroupById(node.id,userTreeData);
        this.props.getLeader();
        this.props.getSelectNode(node.id,selectedGroup);
        this.setState({
            showUserInfo:true
        })
    }

    handleOk() {
        const { setUserGroupDelete,treeFilterState,loginInfo } = this.props;
        const busi_type = this.props.busiType?this.props.busiType:'user-relation';
        let selectedNodeKey = [];
        if (treeFilterState[busi_type] && treeFilterState[busi_type].selectedNodeKey){
            selectedNodeKey = treeFilterState[busi_type].selectedNodeKey;
        }
        //调删除组织接口
        setUserGroupDelete(selectedNodeKey[0],loginInfo.userId)
    }

    handleCancel() {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            modalVisible: false,
        });
    }

    deleteUserGroup(selectedUserGroup){//删除组织
        const {userRelationState,busiType} = this.props;
        const busi_type = busiType?busiType:'user-relation';
        const userInfoData = userRelationState['getUserInfo_'+busi_type]?(
            userRelationState['getUserInfo_'+busi_type].userInfoData?
                userRelationState['getUserInfo_'+busi_type].userInfoData:[]):[];

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
        const {treeFilterState} = this.props;
        const busi_type = this.props.busiType?this.props.busiType:'user-relation';
        let selectedNodeKey = [];
        if (treeFilterState[busi_type] && treeFilterState[busi_type].selectedNodeKey){
            selectedNodeKey = treeFilterState[busi_type].selectedNodeKey;
        }

        if(selectedNodeKey.length==0){
            if(type=='add'){
                message.error('请选择父组织!',3);
            }else{
                message.error('请选择要修改的组织!',3);
            }
        }else{
            this.context.router.push({
                pathname: '/userGroupDetail',
                state: {editType: type, selectedRow}
            });
        }
    }

    insertCallback(messageInfo){
        const {loginInfo} = this.props;
        notification.success({
            message: messageInfo,
            description: '',
            duration: 1
        });
        this.props.getUserRelationTree(loginInfo.userId);
    }

    componentWillReceiveProps(nextProps) {
        const {deleteUserGroup,userRelationTree,selectNode} = nextProps;
        //删除返回信息
        if(this.props.deleteUserGroup && deleteUserGroup){
            if (this.props.deleteUserGroup.deleteResult != deleteUserGroup.deleteResult
                && deleteUserGroup.deleteResult) {
                this.setState({
                    modalVisible: false,
                });
                this.insertCallback("删除成功");
            }
        }
        //修改组织后更新组织信息
        const selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';
        if(this.props.userRelationTree && userRelationTree){
            if(this.props.userRelationTree.userTreeData != userRelationTree.userTreeData
            && userRelationTree.userTreeData
            && userRelationTree.userTreeData.length > 0){
                if(selectedUserGroup != ''){
                    const resetGroup = findUserGroupById(selectedUserGroup.id,userRelationTree.userTreeData);
                    this.props.getSelectNode(selectedUserGroup.id,resetGroup);
                }
            }
        }
    }

    render(){
        const {userRelationTree,selectNode,deleteUserGroup,visible,treeFilterState,loginInfo} = this.props;
        const selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';
        const loadingTree = userRelationTree?userRelationTree.loading:false;
        const userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];
        const deleteGroupLoading = deleteUserGroup?deleteUserGroup.deleteLoading:false;

        const is_admin = isAdmin(loginInfo.roleList);

        const content = (
            <div>
                <a style={{paddingLeft:10}}
                   onClick={this.editUserGroup.bind(this, 'add', null)}>新建组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editUserGroup.bind(this, null, selectedUserGroup)}>修改组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.deleteUserGroup.bind(this, selectedUserGroup)}>删除组织</a>
            </div>
        );
        const busi_type = this.props.busiType?this.props.busiType:'user-relation';
        let selectedNodeKey = [];
        if (treeFilterState[busi_type] && treeFilterState[busi_type].selectedNodeKey){
            selectedNodeKey = treeFilterState[busi_type].selectedNodeKey;
        }

        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loadingTree}
                        notFoundMsg='找不到组织'
                        inputPlaceholder="快速查询组织"
                        loadingMsg="正在加载组织信息..."
                        nodesData={userTreeData}
                        busiType={busi_type}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    {
                        visible=='true'?<div></div>:(is_admin?(
                            <Row style={{textAlign:'right'}}>
                                <PopoverImg content={content}/>
                            </Row>
                        ):<div/>)
                    }
                    <Row>
                        <UserInfo showUserInfo={this.state.showUserInfo}
                                  selectedNode={selectedNodeKey[0]}
                                  visible={visible}
                                  busiType={busi_type}/>
                        <Modal title="确认删除此组织吗?"
                               visible={this.state.modalVisible}
                               onOk={this.handleOk.bind(this)}
                               onCancel={this.handleCancel.bind(this)}
                               confirmLoading={deleteGroupLoading}
                        >
                            <p>{selectedUserGroup?selectedUserGroup.name:""}</p>
                        </Modal>
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
        userRelationTree:state.UserRelation.getUserRelationTree,
        userRelationState:state.UserRelation,
        selectNode:state.UserRelation.getSelectNode,
        deleteUserGroup:state.UserRelation.deleteUserGroup,
        treeFilterState : state.treeFilter,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserRelationTree:bindActionCreators(getUserRelationTree, dispatch),
        getSelectNode:bindActionCreators(getSelectNode, dispatch),
        setUserGroupDelete:bindActionCreators(setUserGroupDelete, dispatch),
        getLeader:bindActionCreators(getLeader, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRelation);