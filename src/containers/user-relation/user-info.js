/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Row, Modal, notification, Form, Input,Icon,message} from 'antd';
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
            filterKeys:[],
            current:1
        }
    }

    componentWillMount(){
        const {userRelationState,busiType,treeFilterState} = this.props;
        const userInfoData = userRelationState['getUserInfo_'+busiType]?(
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
        const { getGroupsUsers,busiType,treeFilterState} = this.props;
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
        const {moveUserInfo,deleteUserInfo,userRelationState,busiType} = nextProps;
        const userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData
                ?userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        const node = nextProps.selectedNode;
        if(node != this.props.selectedNode && node){
            this.setState({
                dataSource:[],
                current:1
            })
            this.props.getGroupsUsers(parseInt(node),busiType);
        }
        if(userInfoData && this.state.dataSource.length==0){
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
        const dataSource = [];
        for(let i=0; i<userInfoData.length; i++){
            dataSource.push({
                key:userInfoData[i].id?userInfoData[i].id:userInfoData[i].key,
                name:userInfoData[i].name,
                role:userInfoData[i].role,
                email:userInfoData[i].email,
            });
        }
        return dataSource;
    }

    handleOk(node) {
        const { form,loginInfo,MoveUser,DeleteGroupUser,treeFilterState,busiType } = this.props;
        const formData = form.getFieldsValue();
        let selectedNodeKey = [];
        if (treeFilterState[busiType] && treeFilterState[busiType].selectedNodeKey){
            selectedNodeKey = treeFilterState[busiType].selectedNodeKey;
        }
        const data = {};
        data.user_id = loginInfo.userId;
        data.source_user_id = this.state.source_user_id;
        data.reason = formData.reason;
        data.source_group_id = selectedNodeKey[0];
        if(this.state.moveOutVisible){
            //调移除接口
            DeleteGroupUser(data);
            form.resetFields();
        }else if(this.state.moreGroupVisible){
            //调移动接口
            data.dest_group_id = node[0];
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
        const userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        this.setState({
            moveOutVisible: true,
            source_user_id:findUserIdByEmail(record.email,userInfoData)
        });
    }

    editUser(record){
        const {userRelationState,busiType} = this.props;
        const userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        const is_leader = this.isLeader(userInfoData,record);
        if(is_leader == 1){
            message.error('修改组织，将该成员变成普通成员才能移动！',10);
        }else{
            this.setState({
                moreGroupVisible: true,
                source_user_id:findUserIdByEmail(record.email,userInfoData)
            });
        }
    }

    filterChange(filterData,filterKeys,ifFiled){
        if(ifFiled){
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
        const {userRelationState,busiType} = this.props;
        const userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        const user_ids = [];
        for(let i=0; i<selectedRows.length; i++){
            const _id = findUserIdByEmail(selectedRows[i].email,userInfoData);
            user_ids.push(_id);
        }
        this.props.setSelectedRowKeys(selectedRowKeys,user_ids);
    }

    isLeader(dataSource,record){
        let is_leader=0;
        for(let i=0; i<dataSource.length; i++){
            if(dataSource[i].email == record.email){
                is_leader = dataSource[i].is_leader;
                return is_leader;
            }
        }
        return is_leader;
    }

    onChange(page) {//分页切换
        this.setState({
            current: page,
        });
    }

    render(){
        const {userRelationState,deleteUserInfo,userRelationTree, showUserInfo,visible,
            moveUserInfo,busiType,selectedUsers,treeFilterState} = this.props;

        const getUserLoading = userRelationState['getUserInfo_'+busiType]?
            userRelationState['getUserInfo_'+busiType].loading:false;
        const removeUserLoading = deleteUserInfo?deleteUserInfo.deleteLoading:false;
        const loadingTree = userRelationTree?userRelationTree.loading:false;
        const moveLoading = moveUserInfo?moveUserInfo.moveLoading:false;

        const selectedRowKeys = selectedUsers?selectedUsers.selectedKeys:[];
        const userTreeData = userRelationTree?(
            userRelationTree.userTreeData?userRelationTree.userTreeData:[]):[];
        const userInfoData = userRelationState['getUserInfo_'+busiType]?(
            userRelationState['getUserInfo_'+busiType].userInfoData?
                userRelationState['getUserInfo_'+busiType].userInfoData:[]):[];
        let selectedMoreGroup = [];
        const more_group_type='more-user-group';
        if (treeFilterState[more_group_type] && treeFilterState[more_group_type].selectedNodeKey){
            selectedMoreGroup = treeFilterState[more_group_type].selectedNodeKey;
        }

        const {getFieldDecorator} = this.props.form;
        const rowSelection = {
            selectedRowKeys,
            onChange:this.onSelectedChange.bind(this)
        };
        const pagination = {
            pageSize:20,
            current:this.state.current,
            onChange:this.onChange.bind(this)
        };
        const dataSource = this.getDataSource(this.state.dataSource);
        const reasonProps = getFieldDecorator('reason',
            {})(<Input type="textarea" rows={4} />);
        let showOpt = true;
        if(visible){ showOpt = false; }

        if(showUserInfo){
            return(
                <div style={{"paddingLeft":10}}>
                    <Row>
                        <Table style={{"paddingTop":10}}
                               columns={this.groupColumns(this,showOpt,this.data,
                                   userInfoData,this.state.filterKeys)}
                               dataSource={dataSource}
                               rowSelection={showOpt?null:rowSelection}
                               pagination={pagination}
                               loading={getUserLoading}></Table>
                        <Modal title="确认移除此成员吗?"
                               visible={this.state.moveOutVisible}
                               onOk={this.handleOk.bind(this)}
                               confirmLoading={removeUserLoading}
                               onCancel={this.handleCancel.bind(this)}
                        >
                            <span>移除成员后，该成员再进入系统需要使用新邮箱重新注册！如果确认，请输入原因：</span>
                            <FormItem>
                                {reasonProps}
                            </FormItem>
                        </Modal>
                        <MoreUserGroup modalVisible={this.state.moreGroupVisible}
                                       loading={loadingTree}
                                       confirmLoading={moveLoading}
                                       nodesData={userTreeData}
                                       selectedMoreGroup={selectedMoreGroup}
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

UserInfo.prototype.groupColumns = (self,showOpt,dataSource,userInfoData,filterKeys)=>{
    if(showOpt){
        return [
            {title: (<TableFilterTitle id="name" title="员工姓名"
                                       filterKey="name"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
                                       filterChange={self.filterChange.bind(self)}/>), dataIndex: "name", key: "name",
                render(text,record){
                    const is_leader = self.isLeader(userInfoData,record);
                    return (is_leader==1?<div>{text}<Icon type="user" style={{fontSize:18,paddingLeft:'7px'}}/>
                    </div>:<div>{text}</div>)
                }},
            {title: (<TableFilterTitle id="role" title="角色"
                                       filterKey="role"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
                                       filterChange={self.filterChange.bind(self)}/>), dataIndex: "role", key: "role"},
            {title: "邮箱", dataIndex: "email", key: "email"},
            {title:"操作",dataIndex:"operate",key:"operate",
                render(text,record){
                    return (
                        <div>
                            <Button type="ghost" onClick={self.moveOutUser.bind(self, 'delete', record)}>移除</Button>
                            <Button type="ghost" onClick={self.editUser.bind(self, record)}>移动</Button>
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
                                       filterChange={self.filterChange.bind(self)}/>), dataIndex: "name", key: "name",
                render(text,record){
                    const is_leader = self.isLeader(userInfoData,record);
                    return (is_leader==1?<div>{text}<Icon type="user" style={{fontSize:18,paddingLeft:'7px'}}/>
                    </div>:<div>{text}</div>)
                }},
            {title: (<TableFilterTitle id="role" title="角色"
                                       filterKey="role"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
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

