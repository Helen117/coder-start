/**
 * Created by Administrator on 2016-09-20.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button,Modal,Select,notification,Table,message,Row,Col} from 'antd';
import styles from './index.css';
import UserRelation from '../user-relation';
import {addProjectMember,deleteProjectMember} from './actions/project-member-action';
import {getProjectMembers} from '../project-mgr/actions/project-members-action';
import {findUserIdByEmail} from '../user-relation/utils';


const Option = Select.Option;
const confirm = Modal.confirm;

class ProjectMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addProjectMember:false,
            accessLevel:40,
            selectedUsers:[],
        }
    }

    componentWillReceiveProps(nextProps) {
        const {addResult, addErrors,deleteResult,deleteErrors} = nextProps;
        //添加返回信息
        if (this.props.addResult != addResult && addResult) {
            this.insertCallback("添加成功");
        }
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult) {
            this.insertCallback("删除成功");
        }
    }

    insertCallback(messageInfo){
        notification.success({
            message: messageInfo,
            description: '',
            duration: 2
        });
        this.setState({
            addProjectMember: false
        });
        //调项目成员接口
        const {actions,projectInfo} = this.props;
        actions.getProjectMembers(projectInfo.id);
    }

    transformDate(timestamp){
        var newDate = new Date();
        newDate.setTime(timestamp);
        return newDate.toLocaleDateString();
    }

    addMember(projectId){
        this.setState({
            addProjectMember: true,
        });
    }

    deleteMember(projectId,user_ids){
        const {actions,loginInfo} = this.props;
        if(user_ids.length > 0){
            confirm({
                title: '您是否确定要删除这些成员？',
                content: '',
                onOk() {
                    //调删除成员接口
                    let data = [],final_data={};
                    for(let i=0;i<user_ids.length;i++){
                        data.push({
                            projectId:projectId,
                            userId:user_ids[i]
                        })
                    }
                    final_data.users = data;
                    final_data.id = loginInfo.userId;
                    actions.deleteProjectMember(final_data)
                },
                onCancel() {
                }
            })
        }else{
            message.error('请选择要删除的成员!',3);
        }
    }

    handleOk(){
        //调添加成员接口
        const {actions,projectInfo,loginInfo} = this.props;
        let data = [],final_data={};
        for(let i=0; i<this.state.selectedUsers.length; i++){
            data.push({
                projectId:projectInfo.id,
                gitlabAccessLevel:this.state.accessLevel,
                userId:this.state.selectedUsers[i],
            })
        }
        final_data.users = data;
        final_data.id = loginInfo.userId;
        actions.addProjectMember(final_data);
    }

    handleCancel(){
        this.setState({
            addProjectMember: false
        });
    }

    changeSelect(value){
        this.setState({
            accessLevel:value
        })
    }

    selectedUser(users){
        this.setState({
            selectedUsers:users
        })
    }

    render(){
        const {projectMembers,projectInfo} = this.props;

        const columns = [
            {title: "项目人员", dataIndex: "name", key: "name"},
            {title: "角色", dataIndex: "role", key: "role"},
            {title: "邮箱", dataIndex: "email", key: "email"},
            {title: "进入项目时间", dataIndex: "join_time", key: "join_time"},
            {title: "人员状态", dataIndex: "state", key: "state"}
        ];
        const dataSource = [];
        if(projectMembers){
            for(var i=0;i<projectMembers.length;i++){
                let role = '';
                if(projectMembers[i].role == 40){
                    role = '管理员';
                }else if(projectMembers[i].role == 30){
                    role = '开发者';
                } else if(projectMembers[i].role == 20){
                    role = '测试';
                }else if(projectMembers[i].role == 50){
                    role = '创建者';
                }
                dataSource.push({
                    key:i+1,
                    name:projectMembers[i].name,
                    role:role,
                    email:projectMembers[i].email,
                    join_time:this.transformDate(projectMembers[i].created_at),
                    state:projectMembers[i].state
                });
            }
        }
        let user_ids = [];
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {},
            onSelect(record, selected, selectedRows) {
                user_ids.splice(0,user_ids.length);
                for(let i=0; i<selectedRows.length; i++){
                    let _id = findUserIdByEmail(selectedRows[i].email,projectMembers);
                    user_ids.push(_id);
                }
            },
            onSelectAll(selected, selectedRows, changeRows) {
                user_ids.splice(0,user_ids.length);
                for(let i=0; i<selectedRows.length; i++){
                    let _id = findUserIdByEmail(selectedRows[i].email,projectMembers);
                    user_ids.push(_id);
                }
            },
        };
        const projectDesc = projectInfo?(
            <Row>
                <Col span={8}>项目名称:{projectInfo.name}</Col>
                <Col span={5}>项目创建时间:{this.transformDate(projectInfo.created_at)}</Col>
                <Col span={11}>项目创建目的:{projectInfo.description}</Col>
            </Row>
        ):(<div></div>);

        return (
            <div className={styles.project_list_div}>
                {projectDesc}
                <Table columns={columns} dataSource={dataSource}
                       rowSelection={rowSelection}
                       loading={this.props.membersLoading}></Table>
                <Modal title="添加成员"
                       width="80%"
                       visible={this.state.addProjectMember}
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}
                       confirmLoading={this.props.addLoading?true:false}
                >
                    <div style={{paddingLeft:'10px'}}>
                        <span>添加成员作为：</span>
                        <Select id="access_level" defaultValue="40"
                                onChange={this.changeSelect.bind(this)}>
                            <Option value="40">管理员</Option>
                            <Option value="30">开发者</Option>
                            <Option value="20">测试</Option>
                        </Select>
                    </div>
                    <UserRelation visible='true' onSelected={this.selectedUser.bind(this)}/>
                </Modal>
                <div style={{paddingTop:'10px'}}>
                    <Button type="primary" onClick={this.addMember.bind(this,projectInfo.id)}>添加人员</Button>
                    <Button type="primary" onClick={this.deleteMember.bind(this,projectInfo.id,user_ids)}>删除人员</Button>
                </div>
            </div>
        )
    }
}
ProjectMember.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        projectMembers:state.getProjectMembers.projectMembers,
        membersLoading:state.getProjectMembers.loading,
        addResult:state.addProjectMember.addResult,
        addLoading:state.addProjectMember.addLoading,
        addDisabled:state.addProjectMember.addDisabled,
        addErrors:state.addProjectMember.addErrors,
        deleteResult:state.addProjectMember.deleteResult,
        deleteLoading:state.addProjectMember.deleteLoading,
        deleteDisabled:state.addProjectMember.deleteDisabled,
        deleteErrors:state.addProjectMember.deleteErrors,
        projectInfo:state.getProjectInfo.projectInfo,
        groupInfo:state.getGroupInfo.groupInfo,
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({addProjectMember,getProjectMembers,deleteProjectMember},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectMember);








