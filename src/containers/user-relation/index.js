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
        this.props.getSelectNode(node.id);
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

    handleOk(groupInfo) {
        const { form } = this.props;
        const formData = form.getFieldsValue();
        //console.log("formData:",formData)
        const {setGroupDelete, loginInfo} = this.props;
        //调删除项目组的接口
        setGroupDelete(loginInfo.username, groupInfo.id)
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
    }

    deleteUserGroup(selectedUserGroup){//删除组织
        if(selectedUserGroup){
            this.setState({
                modalVisible: true,
            });
            /*if(selectedUserGroup.children.length == 0){
                this.setState({
                    modalVisible: true,
                });
            }else{
                message.error('组织不为空，不能删除!',3);
            }*/
        }else{
            message.error('请选择需要删除的组织！',3);
        }
    }

    editUserGroup(type,selectedRow){//新增、修改组织
        if(!type && !selectedRow){
            message.error('请选择要修改的组织!',3);
        }else{
            this.context.router.push({
                pathname: '/userGroupDetail',
                state: {editType: type, selectedRow}
            });
        }
    }

    editUser(type,selectedRow){//新增人员

    }

    render(){
        const {userTreeData, loading, selectedNode, selectedUserGroup} = this.props;
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
                        {/*<Modal title="确认删除此项目组吗?"
                               visible={this.state.modalVisible}
                               onOk={this.handleOk.bind(this,groupInfo)}
                               confirmLoading={deleteLoading?true:false}
                               onCancel={this.handleCancel.bind(this)}
                        >
                            <p>如果确认此操作，请在下框输入原因：</p>
                            <FormItem>
                                <Input type="textarea" {...deleteResultProps} rows={4} />
                            </FormItem>
                        </Modal>*/}
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

function mapStateToProps(state) {
    return {
        loading : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
        selectedNode: state.getSelectNode.selectedNode,
        selectedUserGroup: state.getSelectNode.selectedUserGroup,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserRelationTree:bindActionCreators(getUserRelationTree, dispatch),
        getSelectNode:bindActionCreators(getSelectNode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRelation);