/**
 * Created by Administrator on 2016-09-20.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Form,Button,Modal,Select,notification,Table,message,Row,Col} from 'antd';
import styles from './index.css';
import UserRelation from '../user-relation';
import {addProjectMember,deleteProjectMember,
    getProjectMembers} from './actions/project-member-action';
import {findUserIdByEmail} from '../user-relation/utils';
import {comfirmRoleId} from './util';
import 'pubsub-js';
import {getProjectInfo} from '../project-mgr/actions/create-project-action';
import {setSelectedRowKeys} from '../user-relation/actions/user-relation-actions';
import TableFilterTitle from '../../components/table-filter-title';


const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

class ProjectMember extends Component {
    constructor(props) {
        super(props);
        this.data = [];
        this.state = {
            addProjectMember:false,
            accessLevel:40,
            selectedRowKeys:[],
            selectedUserIds:[],

            filterKeys:[],
            dataSource:[],
        }
    }

    componentWillReceiveProps(nextProps) {
        const {projectMember} = nextProps;
        //设置this.state.dataSource等初始值
        if(this.props.projectMember.getProjectMembers && projectMember.getProjectMembers
            && projectMember.getProjectMembers.projectMembers &&
            this.props.projectMember.getProjectMembers.projectMembers != projectMember.getProjectMembers.projectMembers ){
            this.data = this.getDataSource(projectMember.getProjectMembers.projectMembers);
            this.setState({
                dataSource:projectMember.getProjectMembers.projectMembers
            })
        }
        //添加返回信息
        if(this.props.projectMember.addProjectMember && projectMember.addProjectMember
        && this.props.projectMember.addProjectMember.result !=
            projectMember.addProjectMember.result && projectMember.addProjectMember.result){
                this.insertCallback("添加成功");
        }
        //删除返回信息
        if(this.props.projectMember.deleteProjectMember && projectMember.deleteProjectMember
        && this.props.projectMember.deleteProjectMember.result !=
            projectMember.deleteProjectMember.result && projectMember.deleteProjectMember.result){
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
            addProjectMember: false,
            selectedRowKeys:[],
            selectedUserIds:[]
        });
        //调项目成员接口
        const {actions,loginInfo,projectGroup} = this.props;
        const selectedKey = projectGroup.getGroupInfo?projectGroup.getGroupInfo.node:'';
        const projectId = selectedKey.id.substr(0,selectedKey.id.length-2);
        this.props.getProject(projectId,loginInfo.userId);
        actions.getProjectMembers(projectId);
        this.props.setSelectedRowKeys([],[]);
    }

    transformDate(timestamp){
        var newDate = new Date();
        if(timestamp){
            newDate.setTime(timestamp);
            return newDate.toLocaleDateString();
        }else {
            return '';
        }
    }

    addMember(){
        this.setState({
            addProjectMember: true,
        });
        PubSub.publish("evtRefreshUserGroupTree",{});
    }

    deleteMember(projectId,user_ids){
        const {actions,loginInfo} = this.props;
        if(user_ids.length > 0){
            confirm({
                title: '您是否确定要删除这些成员？',
                content: '',
                onOk() {
                    //调删除成员接口
                    const data = [],final_data={};
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
                    //取消
                }
            })
        }else{
            message.error('请选择要删除的成员!',3);
        }
    }

    handleOk(){
        //调添加成员接口
        const {form,actions,project,loginInfo,selectedUsers} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = [],final_data={};
                const projectInfo = project.getProjectInfo?(
                    project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
                ):{};
                const user_ids = selectedUsers?selectedUsers.user_ids:[];
                for(let i=0; i<user_ids.length; i++){
                    data.push({
                        projectId:projectInfo.id,
                        gitlabAccessLevel:this.state.accessLevel,
                        userId:user_ids[i],
                    })
                }
                final_data.users = data;
                final_data.id = loginInfo.userId;
                actions.addProjectMember(final_data);
            }
        })
    }

    handleCancel(){
        const {form} = this.props;
        this.setState({
            addProjectMember: false
        });
        form.resetFields();
        this.props.setSelectedRowKeys([],[]);
    }

    changeSelect(value){
        this.setState({
            accessLevel:value
        })
    }

    onSelectedChange(selectedRowKeys, selectedRows){
        const {projectMember} = this.props;
        const projectMembers = projectMember.getProjectMembers?(
            projectMember.getProjectMembers?projectMember.getProjectMembers.projectMembers:[]
        ):[];
        const user_ids = [];
        for(let i=0; i<selectedRows.length; i++){
            const _id = findUserIdByEmail(selectedRows[i].email,projectMembers);
            user_ids.push(_id);
        }
        this.setState({selectedRowKeys,selectedUserIds:user_ids})
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

    transformRole(role){
        let role_temp = '';
        if(role == 40){
            role_temp = '管理员';
        }else if(role == 30){
            role_temp = '开发者';
        } else if(role == 20){
            role_temp = '测试';
        }else if(role == 50){
            role_temp = '创建者';
        }

        return role_temp;
    }

    transformData(data){
        let data_temp = [];
        if(data.length > 0){
            for(var i=0;i<data.length;i++){
                if(data[i].created_at){
                    let temp = {};
                    temp.name = data[i].name;
                    temp.role = this.transformRole(data[i].role);
                    temp.email = data[i].email;
                    temp.join_time = this.transformDate(data[i].created_at);
                    temp.state = data[i].state;

                    data_temp.push(temp);
                }else {
                    data_temp = data;
                }
            }
        }

        return data_temp;
    }

    getDataSource(userInfoData){
        const dataSource = [];
        const data = this.transformData(userInfoData);
        for(let i=0;i<data.length;i++){
            dataSource.push({
                key:i+1,
                name:data[i].name,
                role:data[i].role,
                email:data[i].email,
                join_time:data[i].join_time,
                state:data[i].state
            });
        }

        return dataSource;
    }

    render(){
        const {projectMember,project,loginInfo} = this.props;
        const { getFieldDecorator } = this.props.form;
        const {selectedRowKeys} = this.state;
        const formItemLayout = {
            labelCol: {span: 20},
            wrapperCol: {span: 4},
        };

        const projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const projectMembers = projectMember.getProjectMembers?(
            projectMember.getProjectMembers.projectMembers?projectMember.getProjectMembers.projectMembers:[]
        ):[];

        const dataSource = this.getDataSource(this.state.dataSource);
        const rowSelection = {
            selectedRowKeys,
            onChange:this.onSelectedChange.bind(this)
        };
        const projectDesc = projectInfo?(
            <div>
                <span>项目名称:{projectInfo.name}</span>
                <span style={{paddingLeft:20}}>
                    项目创建时间:{this.transformDate(projectInfo.create_date)}</span>
                <span style={{paddingLeft:20}}>项目创建目的:{projectInfo.description}</span>
            </div>
        ):(<div></div>);
        const projectId = projectInfo?projectInfo.id:'';
        const membersLoading = projectMember.getProjectMembers?projectMember.getProjectMembers.loading:false;
        const addLoading = projectMember.addProjectMember?projectMember.addProjectMember.loading:false;

        return (
            <div className={styles.project_list_div}>
                {projectDesc}
                <Table columns={this.groupColumns(this,this.data,this.state.filterKeys)}
                       dataSource={dataSource}
                       rowSelection={rowSelection}
                       loading={membersLoading}
                       style={{paddingTop:"10px"}}></Table>
                <Modal title="添加成员"
                       width="80%"
                       visible={this.state.addProjectMember}
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}
                       confirmLoading={addLoading}
                >
                    <UserRelation visible='true'
                                  busiType="add-members"/>
                    <FormItem {...formItemLayout} label="添加成员作为">
                        {getFieldDecorator('access_level',{rules:[
                            {required:true, message:'请为添加的成员选择角色！'},
                        ]})(
                            <Select
                                style={{ width: '100%' }}
                                placeholder="请选择角色"
                                onChange={this.changeSelect.bind(this)}
                            >
                                <Option value="40">管理员</Option>
                                <Option value="30">开发者</Option>
                                <Option value="20">测试</Option>
                            </Select>
                        )}
                    </FormItem>
                </Modal>
                {comfirmRoleId(loginInfo.userId,projectMembers)?(
                    <div style={{paddingTop:'10px'}}>
                        <Button type="primary" onClick={this.addMember.bind(this)}>添加人员</Button>
                        <Button type="primary" onClick={this.deleteMember.bind(this,projectId,this.state.selectedUserIds)}>删除人员</Button>
                    </div>
                ):<div></div>}
            </div>
        )
    }
}
ProjectMember.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectMember.prototype.groupColumns = (self,dataSource,filterKeys)=>{
    return [
        {title: (<TableFilterTitle id="name" title="项目人员"
                                   filterKey="name"
                                   filterKeys={filterKeys}
                                   dataSource={dataSource}
                                   filterChange={self.filterChange.bind(self)}/>), dataIndex: "name", key: "name"},
        {title: (<TableFilterTitle id="role" title="角色"
                                   filterKey="role"
                                   filterKeys={filterKeys}
                                   dataSource={dataSource}
                                   filterChange={self.filterChange.bind(self)}/>), dataIndex: "role", key: "role"},
        {title: "邮箱", dataIndex: "email", key: "email"},
        {title: "进入项目时间", dataIndex: "join_time", key: "join_time"},
        {title: "人员状态", dataIndex: "state", key: "state"}
    ]
};

ProjectMember = Form.create()(ProjectMember);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        projectMember:state.projectMember,
        project:state.project,
        projectGroup:state.projectGroup,
        selectedUsers:state.UserRelation.selectedUsers,
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({addProjectMember,getProjectMembers,deleteProjectMember},dispatch),
        getProject:bindActionCreators(getProjectInfo, dispatch),
        setSelectedRowKeys:bindActionCreators(setSelectedRowKeys, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectMember);






