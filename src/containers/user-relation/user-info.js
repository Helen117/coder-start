/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Row, Col} from 'antd';
import {getUserInfo} from './actions/user-info-action';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const {userInfoData} = this.props;
        if(userInfoData.length == 0){
            this.props.getUserInfo();
        }
    }

    componentWillReceiveProps(nextProps){
        const node = nextProps.location.state.node;
        if(node != this.props.location.state.node && node){
            this.props.getUserInfo();
        }
    }

    getDataSource(userInfoData){
        let dataSource = [];
        for(let i=0; i<userInfoData.length; i++){
            dataSource.push({
                key:i+1,
                userName:userInfoData[i].name,
                department:userInfoData[i].department,
                leader:userInfoData[i].leader,
                role:userInfoData[i].role,
                status:userInfoData[i].status,
            });
        }
        return dataSource;
    }

    roleApply(){

    }

    addToProject(){

    }

    editUser(type,selectedRow){//修改人员

    }

    userGroupRelation(){//移动人员

    }

    deleteUser(selectedUserGroup){//删除人员

    }

    render(){
        const {userInfoData, loading} = this.props;
        let add_member = this.props.location.state.addMember;
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect(record, selected, selectedRows) {
                //console.log(record, selected, selectedRows);
            },
            onSelectAll(selected, selectedRows, changeRows) {
                //console.log(selected, selectedRows, changeRows);
            },
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

function mapStateToProps(state) {
    return {
        userInfoData:state.getUserInfo.userInfoData,
        loading:state.getUserInfo.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserInfo:bindActionCreators(getUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);

UserInfo.prototype.groupColumns = (self)=>[
    {title: "员工姓名", dataIndex: "userName", key: "userName"},
    {title: "员工部门", dataIndex: "department", key: "department"},
    {title: "上级领导", dataIndex: "leader", key: "leader"},
    {title: "角色", dataIndex: "role", key: "role"},
    {title: "人员状态", dataIndex: "status", key: "status"},
    {title:"操作",dataIndex:"operate",key:"operate",
        render(text,record){
            return (
                <div>
                    <Button type="ghost"
                            onClick={self.editUser.bind(self, 'modify', record)}>修改</Button>
                    <Button type="ghost"
                            onClick={self.deleteUser.bind(self, 'delete', record)}>删除</Button>
                </div>
            )
        }
    }
];