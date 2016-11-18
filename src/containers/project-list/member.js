/**
 * Created by Administrator on 2016-09-20.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {connect} from 'react-redux';
import {Button,Modal} from 'antd';
import TableView from '../../components/table';
import styles from './index.css';
import UserRelation from '../user-relation';

class ProjectMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addProjectMember:false
        }
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

    deleteMember(){

    }

    handleOk(){
        this.setState({
            addProjectMember: false
        });
    }

    handleCancel(){
        this.setState({
            addProjectMember: false
        });
    }

    render(){
        const {projectMembers} = this.props;
        var groupInfo = this.props.location.state.groupInfo;
        var projectInfo = this.props.location.state.projectInfo;

        const columns = [
            {title: "项目人员", dataIndex: "name", key: "name"},
            {title: "角色", dataIndex: "role", key: "role"},
            {title: "进入项目时间", dataIndex: "join_time", key: "join_time"},
            {title: "人员状态", dataIndex: "state", key: "state"}
        ];
        const dataSource = [];
        for(var i=0;i<projectMembers.projectMembers.length;i++){
            dataSource.push({
                key:i+1,
                name:projectMembers.projectMembers[i].name,
                role:projectMembers.projectMembers[i].is_admin?"admin":"非admin",
                join_time:this.transformDate(projectMembers.projectMembers[i].created_at),
                state:projectMembers.projectMembers[i].state
            });
        }

        return (
            <div className={styles.project_list_div}>
                <div>
                    <p>项目名称:{projectInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目创建时间:{this.transformDate(projectInfo.created_at)}&nbsp;&nbsp;&nbsp;&nbsp;项目组名称:{groupInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.description}</p>
                </div>
                <TableView columns={columns}
                           dataSource={dataSource}
                ></TableView>
                <Modal title="添加成员"
                       width="80%"
                       visible={this.state.addProjectMember}
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}
                >
                    <UserRelation visible='true'/>
                </Modal>
                <div>
                    <Button type="primary" onClick={this.addMember.bind(this,projectInfo.id)}>添加人员</Button>
                    <Button type="primary" onClick={this.deleteMember.bind(this)}>删除人员</Button>
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
    }
}

export default connect(mapStateToProps)(ProjectMember);








