/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Row, Col, message, Modal, notification, Form, Input} from 'antd';
import {getUserInfo} from './actions/user-info-action';
import {MoveUser,DeleteGroupUser} from './actions/user-detail-action';
import TableFilter from '../../components/table-filter';
import MoreUserGroup from '../../components/more-user-group';
import {findUserIdByEmail} from './utils';

const FormItem = Form.Item;

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moveOutVisible:false,
            moreGroupVisible:false,
            source_user_id:null,
        }
    }

    componentDidMount(){
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
        const {selectedUserGroup, moveResult,moveErrors,deleteResult,deleteErrors} = nextProps;
        const node = nextProps.location.state.node;
        if(node != this.props.location.state.node && node){
            this.props.getUserInfo(selectedUserGroup.id);
        }
        //移除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                moveOutVisible: false,
            });
            this.insertCallback('移除成功!');
        }else if(this.props.deleteErrors != deleteErrors && deleteErrors){
            this.errCallback('移除失败!',deleteErrors);
        }

        //移动返回信息
        if (this.props.moveResult != moveResult && moveResult){
            this.setState({
                moreGroupVisible: false,
            });
            this.insertCallback('移动成功!');
        }else if(this.props.moveErrors != moveErrors && moveErrors){
            this.errCallback('移动失败!',moveErrors);
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

    roleApply(){

    }

    addToProject(){

    }

    handleOk(node) {
        const { form,loginInfo,selectedUserGroup,MoveUser,DeleteGroupUser } = this.props;
        const formData = form.getFieldsValue();
        let data = {};
        data.user_id = loginInfo.userId;
        data.source_user_id = this.state.source_user_id;
        data.reason = formData.reason;
        if(this.state.moveOutVisible == true){
            //调移除接口
            data.dest_group_id = selectedUserGroup.id;
            DeleteGroupUser(data);
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

    render(){
        const {userInfoData, loading} = this.props;
        const {getFieldProps} = this.props.form;
        let add_member = this.props.location.state.addMember;
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {},
            onSelect(record, selected, selectedRows) {},
            onSelectAll(selected, selectedRows, changeRows) {},
        };
        let dataSource = this.getDataSource(userInfoData);
        const reasonProps = getFieldProps('reason',
            {});

        return(
            <div style={{"paddingLeft":10}}>
                <Row>
                    <Table style={{"paddingTop":10}}
                           columns={this.groupColumns(this)}
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
                         <Input type="textarea" {...reasonProps} rows={4} />
                         </FormItem>
                    </Modal>
                    <MoreUserGroup modalVisible={this.state.moreGroupVisible}
                                   loading={this.props.loadingTree}
                                   confirmLoading={this.props.moveLoading?true:false}
                                   nodesData={this.props.userTreeData}
                                   handleOk={this.handleOk.bind(this)}
                                   cancelChoose={this.handleCancel.bind(this)}/>
                </Row>
                <Row>
                    {/*<Button type="primary"
                     onClick={this.roleApply.bind(this)}>角色申请</Button>*/}
                    {add_member?(
                        <Button type="primary"
                                onClick={this.addToProject.bind(this)}>添加到项目</Button>
                    ):(<div></div>)}
                </Row>
            </div>
        )
    }
}

UserInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

UserInfo.prototype.groupColumns = (self)=>[
    {title: "员工姓名", dataIndex: "name", key: "name",
        filterDropdown:(
            <TableFilter/>)},
    {title: "角色", dataIndex: "role", key: "role",
        filters: [
            { text: 'Joe', value: 'Joe' },
            { text: 'Jim', value: 'Jim' },
        ],
        onFilter: (value, record) => record.name.includes(value)},
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
];

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

