/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Row, Modal, notification, Form, Input,Icon} from 'antd';
import {getUserInfo} from './actions/user-relation-actions';
import {MoveUser,DeleteGroupUser,setSelectedRowKeys} from './actions/user-relation-actions';
import TableFilterTitle from '../../components/table-filter-title';
import MoreUserGroup from '../../components/more-user-group';
import {findUserIdByEmail} from './utils';

const FormItem = Form.Item;

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
        this.state = {
            moveOutVisible:false,
            moreGroupVisible:false,
            source_user_id:null,
            dataSource:[],
            filterKeys:[]
        }
    }

    componentWillMount(){
        const {userRelationState,selectNode,busiType,treeFilterState} = this.props;
        let userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        let selectedNodeKey = [];
        if (treeFilterState[busiType] && treeFilterState[busiType].selectedNodeKey){
            selectedNodeKey = treeFilterState[busiType].selectedNodeKey;
        }
        if(selectedNodeKey.length>0 && userInfoData.length == 0){
            this.props.getGroupsUsers(parseInt(selectedNodeKey[0]),busiType);
        }
    }

    insertCallback(messageInfo){
        const { selectNode, getGroupsUsers,busiType,treeFilterState} = this.props;
        let selectedNodeKey = [];
        if (treeFilterState[busiType] && treeFilterState[busiType].selectedNodeKey){
            selectedNodeKey = treeFilterState[busiType].selectedNodeKey;
        }
        notification.success({
            message: messageInfo,
            description: '',
            duration: 1
        });
        //调成员展示接口
        getGroupsUsers(parseInt(selectedNodeKey[0]),busiType);
    }

    componentWillReceiveProps(nextProps){
        const {selectNode, moveUserInfo,deleteUserInfo,userRelationState,busiType} = nextProps;
        let userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData
                ?userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        const node = nextProps.selectedNode;
        if(node != this.props.selectedNode && node){
            this.props.getGroupsUsers(parseInt(node),busiType);
        }
        if(userInfoData){
            this.data = this.getDataSource(userInfoData);
            this.setState({
                dataSource:userInfoData
            })
        }
        //移除返回信息
        if(this.props.deleteUserInfo && deleteUserInfo){
            if (this.props.deleteUserInfo.deleteResult != deleteUserInfo.deleteResult
                && deleteUserInfo.deleteResult) {
                this.setState({
                    moveOutVisible: false,
                });
                this.insertCallback('移除成功!');
            }
        }
        //移动返回信息
        if(this.props.moveUserInfo && moveUserInfo){
            if (this.props.moveUserInfo.moveResult != moveUserInfo.moveResult
                && moveUserInfo.moveResult) {
                this.setState({
                    moreGroupVisible: false,
                });
                this.insertCallback('移动成功!');
            }
        }
    }

    getDataSource(userInfoData){
        let dataSource = [];
        for(let i=0; i<userInfoData.length; i++){
            dataSource.push({
                key:i+1,
                name:userInfoData[i].name,
                role:userInfoData[i].role,
                email:userInfoData[i].email,
            });
        }
        return dataSource;
    }

    handleOk(node) {
        const { form,loginInfo,selectNode,MoveUser,DeleteGroupUser,treeFilterState,busiType } = this.props;
        const formData = form.getFieldsValue();
        let selectedNodeKey = [];
        if (treeFilterState[busiType] && treeFilterState[busiType].selectedNodeKey){
            selectedNodeKey = treeFilterState[busiType].selectedNodeKey;
        }
        let data = {};
        data.user_id = loginInfo.userId;
        data.source_user_id = this.state.source_user_id;
        data.reason = formData.reason;
        data.source_group_id = selectedNodeKey[0];
        if(this.state.moveOutVisible == true){
            //调移除接口
            DeleteGroupUser(data);
            form.resetFields();
        }else if(this.state.moreGroupVisible == true){
            //调移动接口
            data.dest_group_id = node.id;
            MoveUser(data);
        }
    }

    handleCancel() {
        const {form} = this.props;
        this.setState({
            moveOutVisible: false,
            moreGroupVisible:false
        });
        form.resetFields();
    }

    moveOutUser(type,record){
        const {userRelationState,busiType} = this.props;
        let userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        this.setState({
            moveOutVisible: true,
            source_user_id:findUserIdByEmail(record.email,userInfoData)
        });
    }

    editUser(type,record){
        const {userRelationState,busiType} = this.props;
        let userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        this.setState({
            moreGroupVisible: true,
            source_user_id:findUserIdByEmail(record.email,userInfoData)
        });
    }

    filterChange(filterData,filterKeys,ifFiled){
        if(ifFiled == true){
            let countKey = 0;
            for(let i=0; i<this.state.filterKeys.length; i++){
                if(filterKeys[0].filterKey == this.state.filterKeys[i].filterKey){
                    countKey++;
                    this.state.filterKeys[i].formData = filterKeys[0].formData;
                }
            }
            if(countKey == 0){
                this.state.filterKeys.push(filterKeys[0]);
            }
            this.setState({
                dataSource:filterData,
            })
        }else{
            this.setState({
                dataSource:filterData,
                filterKeys:filterKeys
            })
        }
    }

    onSelectedChange(selectedRowKeys, selectedRows){
        const {userRelationState,onSelected,busiType} = this.props;
        let userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        let user_ids = [];
        for(let i=0; i<selectedRows.length; i++){
            let _id = findUserIdByEmail(selectedRows[i].email,userInfoData);
            user_ids.push(_id);
        }
        this.props.setSelectedRowKeys(selectedRowKeys,user_ids);
    }

    render(){
        const {userRelationState,deleteUserInfo,userRelationTree, showUserInfo,visible,
            moveUserInfo,busiType,selectedUsers} = this.props;

        let getUserLoading = userRelationState['getUserInfo_'+busiType]?
            userRelationState['getUserInfo_'+busiType].loading:false;
        let removeUserLoading = deleteUserInfo?deleteUserInfo.deleteLoading:false;
        let loadingTree = userRelationTree?userRelationTree.loading:false;
        let moveLoading = moveUserInfo?moveUserInfo.moveLoading:false;

        let selectedRowKeys = selectedUsers?selectedUsers.selectedKeys:[];
        let userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];

        const {getFieldDecorator} = this.props.form;
        const rowSelection = {
            selectedRowKeys,
            onChange:this.onSelectedChange.bind(this)
        };
        const pagination = {
            pageSize:20
        };
        let dataSource = this.getDataSource(this.state.dataSource);
        const reasonProps = getFieldDecorator('reason',
            {})(<Input type="textarea" rows={4} />);
        let showOpt = true;
        if(visible){ showOpt = false; }

        if(showUserInfo == true){
            return(
                <div style={{"paddingLeft":10}}>
                    <Row>
                        <Table style={{"paddingTop":10}}
                               columns={this.groupColumns(this,showOpt,this.data,
                                   this.state.dataSource,this.state.filterKeys)}
                               dataSource={dataSource}
                               rowSelection={showOpt==true?null:rowSelection}
                               pagination={pagination}
                               loading={getUserLoading?true:false}></Table>
                        <Modal title="确认移除此成员吗?"
                               visible={this.state.moveOutVisible}
                               onOk={this.handleOk.bind(this)}
                               confirmLoading={removeUserLoading?true:false}
                               onCancel={this.handleCancel.bind(this)}
                        >
                            <span>移除成员后，该成员再进入系统需要使用新邮箱重新注册！如果确认，请输入原因：</span>
                            <FormItem>
                                {reasonProps}
                            </FormItem>
                        </Modal>
                        <MoreUserGroup modalVisible={this.state.moreGroupVisible}
                                       loading={loadingTree}
                                       confirmLoading={moveLoading?true:false}
                                       nodesData={userTreeData}
                                       handleOk={this.handleOk.bind(this)}
                                       cancelChoose={this.handleCancel.bind(this)}/>
                    </Row>
                </div>
            )
        }else {return <div></div>}
    }
}

UserInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

UserInfo.prototype.groupColumns = (self,showOpt,dataSource,currentData,filterKeys)=>{
    if(showOpt==true){
        return [
            {title: (<TableFilterTitle id="name" title="员工姓名"
                                       filterKey="name"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
                                       currentData={currentData}
                                       filterChange={self.filterChange.bind(self)}/>), dataIndex: "name", key: "name"},
            {title: (<TableFilterTitle id="role" title="角色"
                                       filterKey="role"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
                                       currentData={currentData}
                                       filterChange={self.filterChange.bind(self)}/>), dataIndex: "role", key: "role"},
            {title: "邮箱", dataIndex: "email", key: "email"},
            {title:"操作",dataIndex:"operate",key:"operate",
                render(text,record){
                    return (
                        <div>
                            <Button type="ghost" onClick={self.moveOutUser.bind(self, 'delete', record)}>移除</Button>
                            <Button type="ghost" onClick={self.editUser.bind(self, 'move',record)}>移动</Button>
                        </div>
                    )
                }
            }
        ]
    }else{
        return [
            {title: (<TableFilterTitle id="name" title="员工姓名"
                                       filterKey="name"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
                                       currentData={currentData}
                                       filterChange={self.filterChange.bind(self)}/>), dataIndex: "name", key: "name"},
            {title: (<TableFilterTitle id="role" title="角色"
                                       filterKey="role"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
                                       currentData={currentData}
                                       filterChange={self.filterChange.bind(self)}/>), dataIndex: "role", key: "role"},
            {title: "邮箱", dataIndex: "email", key: "email"},
        ]
    }
};

UserInfo = Form.create()(UserInfo);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        userRelationState:state.UserRelation,
        selectNode:state.UserRelation.getSelectNode,
        userRelationTree:state.UserRelation.getUserRelationTree,
        moveUserInfo:state.UserRelation.moveUserRelation,
        deleteUserInfo:state.UserRelation.deleteUserRelation,
        treeFilterState : state.treeFilter,
        userRelation:state.UserRelation,
        selectedUsers:state.UserRelation.selectedUsers,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupsUsers:bindActionCreators(getUserInfo, dispatch),
        MoveUser:bindActionCreators(MoveUser, dispatch),
        DeleteGroupUser:bindActionCreators(DeleteGroupUser, dispatch),
        setSelectedRowKeys:bindActionCreators(setSelectedRowKeys, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);

