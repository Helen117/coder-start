/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Row, Col, message, Modal, Form, Input} from 'antd';
import {getUserInfo} from './actions/user-info-action';
import styles from './index.css';
import MoreUserGroup from '../../components/more-user-group';

const FormItem = Form.Item;

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            modalVisible:false,
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

    componentWillReceiveProps(nextProps){
        const {selectedUserGroup} = nextProps;
        const node = nextProps.location.state.node;
        if(node != this.props.location.state.node && node){
            this.props.getUserInfo(selectedUserGroup.id);
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

    editUser(type,selectedRow){//修改人员
        const {selectedUserGroup} = this.props;
        if(!selectedUserGroup){
            message.error('请选择人员所在组织!',3);
        }else{
            this.setState({
                modalVisible:true,
            })
        }
    }

    handleOk() {
        const { form } = this.props;
        const formData = form.getFieldsValue();
        //掉删除人员接口
    }

    handleSubmit(){

    }

    comfirmChoose(node){
        //调移动接口
        //action.XXX(username,node.id);
        this.setState({
            modalVisible:false,
        })
    }

    cancelChoose(){
        this.setState({
            modalVisible:false,
        })
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

        return(
            <div style={{"paddingLeft":10}}>
                <Row>
                    <Table style={{"paddingTop":10}}
                           columns={this.groupColumns(this)}
                           dataSource={dataSource}
                           rowSelection={rowSelection}
                           loading={loading?true:false}></Table>
                    <MoreUserGroup modalVisible={this.state.modalVisible}
                                   loading={this.props.loadingTree}
                                   nodesData={this.props.userTreeData}
                                   handleOk={this.comfirmChoose.bind(this)}
                                   cancelChoose={this.cancelChoose.bind(this)}/>
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
            <div className={styles.filter_style}>
                <Form horizontal onSubmit={self.handleSubmit.bind(self)}>
                    <FormItem>
                        <Input />
                        <Button type="ghost">重置</Button>
                        <Button type="ghost">确定</Button>
                    </FormItem>
                </Form>
            </div>)},
    {title: "角色", dataIndex: "role", key: "role"},
    {title: "邮箱", dataIndex: "email", key: "email"},
    {title:"操作",dataIndex:"operate",key:"operate",
        render(text,record){
            return (
                <div>
                    <Button type="ghost"
                            onClick={self.editUser.bind(self, 'move', record)}>移动</Button>
                </div>
            )
        }
    }
];

UserInfo = Form.create()(UserInfo);

function mapStateToProps(state) {
    return {
        userInfoData:state.getUserInfo.userInfoData,
        loading:state.getUserInfo.loading,
        selectedUserGroup: state.getSelectNode.selectedUserGroup,
        loadingTree : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserInfo:bindActionCreators(getUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);

