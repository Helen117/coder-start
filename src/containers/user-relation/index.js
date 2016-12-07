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
import PopoverImg from '../../components/popover-img';
import 'pubsub-js';
import {findUserGroupById} from './utils';
import {setUserGroupDelete} from './actions/user-relation-actions';
import UserInfo from './user-info';
import {getUserLeader} from './actions/user-relation-actions';

class UserRelation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalVisible:false,
            showUserInfo:false
        }
    }

    componentDidMount(){
        const {userRelationTree,loginInfo,selectNode} = this.props;
        let userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];
        let selectedNode = selectNode?selectNode.selectedNode:'';

        PubSub.subscribe("evtRefreshUserGroupTree",()=>this.props.getUserRelationTree(loginInfo.userId));
        if(userTreeData.length == 0){
            this.props.getUserRelationTree(loginInfo.userId);
        }
        if(selectedNode){
            this.setState({
                showUserInfo:true
            })
        }
    }

    onSelectNode(node){
        //根据node.id找到点击的节点的组织的信息
        const {userRelationTree} = this.props;
        let userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];

        let selectedGroup = findUserGroupById(node.id,userTreeData);
        this.props.getSelectNode(node.id,selectedGroup);
        this.props.getUserLeader();
        this.setState({
            showUserInfo:true
        })
    }

    handleOk() {
        const { setUserGroupDelete,selectNode,loginInfo } = this.props;
        let selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';
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
        const {getUserInfo} = this.props;
        let userInfoData = getUserInfo?(
            getUserInfo.userInfoData?getUserInfo.userInfoData:[]):[];

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
        const {selectNode} = this.props;
        let selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';

        if(!selectedUserGroup && !type){
            message.error('请选择要修改的组织!',3);
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
        const {deleteUserGroup} = nextProps;
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
    }

    selectedUser(users){
        const {onSelected} = this.props;
        if(onSelected){
            onSelected(users);
        }
    }

    render(){
        const {userRelationTree,selectNode,deleteUserGroup,visible} = this.props;
        let selectedUserGroup = selectNode?selectNode.selectedUserGroup:'';
        let selectedNode = selectNode?selectNode.selectedNode:'';
        let loadingTree = userRelationTree?userRelationTree.loading:false;
        let userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];
        let deleteGroupLoading = deleteUserGroup?deleteUserGroup.deleteLoading:false;

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

        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loadingTree}
                        notFoundMsg='找不到组织'
                        inputPlaceholder="快速查询组织"
                        loadingMsg="正在加载组织信息..."
                        nodesData={userTreeData}
                        busiType="user-relation"
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    {
                        visible=='true'?<div></div>:(
                            <Row>
                                <PopoverImg content={content}/>
                                <Modal title="确认删除此组织吗?"
                                       visible={this.state.modalVisible}
                                       onOk={this.handleOk.bind(this)}
                                       onCancel={this.handleCancel.bind(this)}
                                       confirmLoading={deleteGroupLoading?true:false}
                                >
                                    <p>{selectedUserGroup?selectedUserGroup.name:""}</p>
                                </Modal>
                            </Row>
                        )
                    }
                    <Row>
                        <UserInfo showUserInfo={this.state.showUserInfo}
                                  selectedNode={selectedNode}
                                  visible={visible}
                                  onSelected={this.selectedUser.bind(this)}/>
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
        getUserInfo:state.UserRelation.getUserInfo,
        selectNode:state.UserRelation.getSelectNode,
        deleteUserGroup:state.UserRelation.deleteUserGroup,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserRelationTree:bindActionCreators(getUserRelationTree, dispatch),
        getSelectNode:bindActionCreators(getSelectNode, dispatch),
        setUserGroupDelete:bindActionCreators(setUserGroupDelete, dispatch),
        getUserLeader:bindActionCreators(getUserLeader, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRelation);