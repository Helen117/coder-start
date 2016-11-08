/**
 * Created by Administrator on 2016-09-20.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import {connect} from 'react-redux';
import {Button} from 'antd';
import TableView from '../../components/table';
import styles from './index.css';

class ProjectMember extends Component {
    constructor(props) {
        super(props);
    }

    transformDate(timestamp){
        var newDate = new Date();
        newDate.setTime(timestamp);
        return newDate.toLocaleString();
    }

    addMember(){

    }

    deleteMember(){

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
                    <div>
                        <Button type="Primary" onClick={this.addMember.bind(this)}/>
                        <Button type="Primary" onClick={this.deleteMember.bind(this)}/>
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








