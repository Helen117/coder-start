/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ReactDOM from "react-dom";
import {Table, Button, Row, Col, message, Modal, notification, Form, Input,Icon} from 'antd';
import {getUserInfo} from './actions/user-info-action';
import {MoveUser,DeleteGroupUser} from './actions/user-detail-action';
import TableFilterTitle from '../../components/table-filter-title';
import MoreUserGroup from '../../components/more-user-group';
import {findUserIdByEmail,findFilterIndex} from './utils';

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
        const {userInfoData,selectedUserGroup} = this.props;
        if(selectedUserGroup){
            if(userInfoData.length == 0){
                this.props.getUserInfo(selectedUserGroup.id);
            }
        }
    }

    insertCallback(messageInfo){
        const {loginInfo, selectedUserGroup, getUserInfo} = this.props;
        notification.success({
            message: messageInfo,
            description: '',
            duration: 1
        });
        //调成员展示接口
        getUserInfo(selectedUserGroup.id);
    }

    errCallback(messageInfo,errMessage){
        notification.error({
            message: messageInfo,
            description:errMessage,
            duration: 4
        });
    }

    componentWillReceiveProps(nextProps){
        const {selectedUserGroup, moveResult,moveErrors,deleteResult,deleteErrors,userInfoData} = nextProps;
        const node = nextProps.selectedNode;
        if(node != this.props.selectedNode && node){
            this.props.getUserInfo(selectedUserGroup.id);
        }
        if(userInfoData){
            this.data = this.getDataSource(userInfoData);
            this.setState({
                dataSource:userInfoData
            })
        }
        //移除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                moveOutVisible: false,
            });
            this.insertCallback('移除成功!');
        /*}else if(this.props.deleteErrors != deleteErrors && deleteErrors){
            this.errCallback('移除失败!',deleteErrors);*/
        }

        //移动返回信息
        if (this.props.moveResult != moveResult && moveResult){
            this.setState({
                moreGroupVisible: false,
            });
            this.insertCallback('移动成功!');
        /*}else if(this.props.moveErrors != moveErrors && moveErrors){
            this.errCallback('移动失败!',moveErrors);*/
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
        const { form,loginInfo,selectedUserGroup,MoveUser,DeleteGroupUser } = this.props;
        const formData = form.getFieldsValue();
        let data = {};
        data.user_id = loginInfo.userId;
        data.source_user_id = this.state.source_user_id;
        data.reason = formData.reason;
        data.source_group_id = selectedUserGroup.id;
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
        const {userInfoData} = this.props;
        this.setState({
            moveOutVisible: true,
            source_user_id:findUserIdByEmail(record.email,userInfoData)
        });
    }

    editUser(type,record){
        const {userInfoData} = this.props;
        this.setState({
            moreGroupVisible: true,
            source_user_id:findUserIdByEmail(record.email,userInfoData)
        });
    }

    comfirmFilter(filterData,filterKeys){
        this.state.filterKeys.push(filterKeys[0]);
        this.setState({
            dataSource:filterData
        })
    }

    cancleFilter(filterData,filterKeys){
        this.setState({
            dataSource:filterData,
            filterKeys:filterKeys
        })
    }

    render(){
        const {userInfoData, loading, showUserInfo,visible,onSelected} = this.props;
        const {getFieldDecorator} = this.props.form;
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {},
            onSelect(record, selected, selectedRows) {
                if(onSelected){
                    let user_ids = [];
                    for(let i=0; i<selectedRows.length; i++){
                        let _id = findUserIdByEmail(selectedRows[i].email,userInfoData);
                        user_ids.push(_id);
                    }
                    onSelected(user_ids);
                }
            },
            onSelectAll(selected, selectedRows, changeRows) {},
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
                               rowSelection={rowSelection}
                               loading={loading?true:false}></Table>
                        <Modal title="确认移除此成员吗?"
                               visible={this.state.moveOutVisible}
                               onOk={this.handleOk.bind(this)}
                               confirmLoading={this.props.deleteLoading?true:false}
                               onCancel={this.handleCancel.bind(this)}
                        >
                            <span>移除成员后，该成员再进入系统需要使用新邮箱重新注册！如果确认，请输入原因：</span>
                            <FormItem>
                                {reasonProps}
                            </FormItem>
                        </Modal>
                        <MoreUserGroup modalVisible={this.state.moreGroupVisible}
                                       loading={this.props.loadingTree}
                                       confirmLoading={this.props.moveLoading?true:false}
                                       nodesData={this.props.userTreeData}
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
                                       comfirmFilter={self.comfirmFilter.bind(self)}
                                       cancleFilter={self.cancleFilter.bind(self)}/>), dataIndex: "name", key: "name"},
            {title: (<TableFilterTitle id="role" title="角色"
                                       filterKey="role"
                                       filterKeys={filterKeys}
                                       dataSource={dataSource}
                                       currentData={currentData}
                                       comfirmFilter={self.comfirmFilter.bind(self)}
                                       cancleFilter={self.cancleFilter.bind(self)}/>), dataIndex: "role", key: "role"},
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
                                       comfirmFilter={self.comfirmFilter.bind(self)}
                                       cancleFilter={self.cancleFilter.bind(self)}/>), dataIndex: "name", key: "name"},
            {title: (<TableFilterTitle id="role" title="角色"
                                       comfirmFilter={self.comfirmFilter.bind(self)}
                                       cancleFilter={self.cancleFilter.bind(self)}/>), dataIndex: "role", key: "role"},
            {title: "邮箱", dataIndex: "email", key: "email"},
        ]
    }
};

UserInfo = Form.create()(UserInfo);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        userInfoData:state.getUserInfo.userInfoData,
        loading:state.getUserInfo.loading,
        selectedUserGroup: state.getSelectNode.selectedUserGroup,
        loadingTree : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
        deleteResult:state.createUser.deleteResult,
        deleteErrors:state.createUser.deleteErrors,
        deleteLoading:state.createUser.deleteLoading,
        moveResult:state.createUser.moveResult,
        moveErrors:state.createUser.moveErrors,
        moveLoading:state.createUser.moveLoading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserInfo:bindActionCreators(getUserInfo, dispatch),
        MoveUser:bindActionCreators(MoveUser, dispatch),
        DeleteGroupUser:bindActionCreators(DeleteGroupUser, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);

