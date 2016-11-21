/**
 * Created by Administrator on 2016-09-20.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button,Modal,Select,notification,Table,message} from 'antd';
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
        } else if (this.props.addErrors != addErrors && addErrors) {
            this.errCallback("添加失败",addErrors);
        }
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult) {
            this.insertCallback("删除成功");
        } else if (this.props.deleteErrors != deleteErrors && deleteErrors) {
            this.errCallback("删除失败",deleteErrors);
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
        const {actions} = this.props;
        let projectInfo = this.props.location.state.projectInfo;
        actions.getProjectMembers(projectInfo.id.substr(0,projectInfo.id.length-2));
    }

    errCallback(messageInfo,errmessage){
        notification.error({
            message: messageInfo,
            description:errmessage,
            duration: null
        });
    }

    transformDate(timestamp){
        var newDate = new Date();
        newDate.setTime(timestamp);
        return newDate.toLocaleString();
    }

    addMember(projectId){
        this.setState({
            addProjectMember: true,
        });
    }

    deleteMember(projectId,user_ids){
        const {actions} = this.props;
        if(user_ids.length > 0){
            confirm({
                title: '您是否确定要删除这些成员？',
                content: '',
                onOk() {
                    //调删除成员接口
                    let data = [];
                    for(let i=0;i<user_ids.length;i++){
                        data.push({
                            projectId:projectId.substr(0,projectId.length-2),
                            userId:user_ids[i]
                        })
                    }
                    actions.deleteProjectMember(data)
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
        const {actions} = this.props;
        let data = [];
        let projectInfo = this.props.location.state.projectInfo;
        let projectId = projectInfo.id.substr(0,projectInfo.id.length-2);
        for(let i=0; i<this.state.selectedUsers.length; i++){
            data.push({
                projectId:parseInt(projectId),
                gitlabAccessLevel:this.state.accessLevel,
                userId:this.state.selectedUsers[i]
            })
        }
        actions.addProjectMember(data);
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
        const {projectMembers} = this.props;
        var groupInfo = this.props.location.state.groupInfo;
        var projectInfo = this.props.location.state.projectInfo;

        const columns = [
            {title: "项目人员", dataIndex: "name", key: "name"},
            {title: "角色", dataIndex: "role", key: "role"},
            {title: "邮箱", dataIndex: "email", key: "email"},
            {title: "进入项目时间", dataIndex: "join_time", key: "join_time"},
            {title: "人员状态", dataIndex: "state", key: "state"}
        ];
        const dataSource = [];
        for(var i=0;i<projectMembers.projectMembers.length;i++){
            dataSource.push({
                key:i+1,
                name:projectMembers.projectMembers[i].name,
                role:projectMembers.projectMembers[i].is_admin?"admin":"非admin",
                email:projectMembers.projectMembers[i].email,
                join_time:this.transformDate(projectMembers.projectMembers[i].created_at),
                state:projectMembers.projectMembers[i].state
            });
        }
        let user_ids = [];
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {},
            onSelect(record, selected, selectedRows) {
                user_ids.splice(0,user_ids.length);
                for(let i=0; i<selectedRows.length; i++){
                    let _id = findUserIdByEmail(selectedRows[i].email,projectMembers.projectMembers);
                    user_ids.push(_id);
                }
            },
            onSelectAll(selected, selectedRows, changeRows) {},
        };

        return (
            <div className={styles.project_list_div}>
                <div>
                    <p>项目名称:{projectInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目创建时间:{this.transformDate(projectInfo.created_at)}&nbsp;&nbsp;&nbsp;&nbsp;项目组名称:{groupInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.description}</p>
                </div>
                <Table columns={columns} dataSource={dataSource}
                       rowSelection={rowSelection}></Table>
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
        projectMembers:state.getProjectMembers,
        addResult:state.addProjectMember.addResult,
        addLoading:state.addProjectMember.addLoading,
        addDisabled:state.addProjectMember.addDisabled,
        addErrors:state.addProjectMember.addErrors,
        deleteResult:state.addProjectMember.deleteResult,
        deleteLoading:state.addProjectMember.deleteLoading,
        deleteDisabled:state.addProjectMember.deleteDisabled,
        deleteErrors:state.addProjectMember.deleteErrors,
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({addProjectMember,getProjectMembers,deleteProjectMember},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectMember);








