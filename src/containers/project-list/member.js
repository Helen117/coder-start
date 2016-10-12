/**
 * Created by Administrator on 2016-09-20.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import {connect} from 'react-redux';
import TableView from '../../components/table';
import styles from './index.css';

class ProjectMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberType:false,
            selectRow:null,
            selectGroup:null,
        };
        this.showProjectMember = this.showProjectMember.bind(this);
        this.notShowMember = this.notShowMember.bind(this);
    }

    componentDidMount() {
        //在此处注册对其他控件发送的消息的响应
        //PubSub.subscribe("evtMemberCountClick",this.showProjectMember.bind(this) );
        //PubSub.subscribe("evtTreeClick",this.notShowMember.bind(this) );
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        //PubSub.unsubscribe("evtMemberCountClick");
        //PubSub.unsubscribe("evtTreeClick");
    }

    showProjectMember(data){
        this.setState({
            memberType:true,
            selectRow:data.record.projectName,
            selectGroup:data.groupInfo,
        })
    }

    notShowMember(msg,data){
        this.setState({
            memberType:false,
        })
    }

    searchGroupByProjectName(projectName,groupInfo){
        var projectInfo;
        for(var i=0;i<groupInfo.children.length;i++){
            if(projectName == groupInfo.children[i].gitlabProject.name){
                projectInfo = groupInfo.children[i];
                return {projectInfo}
            }
        }
    }

    transformDate(timestamp){
        var newDate = new Date();
        newDate.setTime(timestamp);
        return newDate.toLocaleString();
    }

    componentWillReceiveProps(nextProps){
        //const {node} = nextProps.location.state;
        console.log("nextProps.location.state:",nextProps.location.state);
        if(nextProps.location.state){
            this.showProjectMember(nextProps.location.state);
        }
        const { getGroupInfo } = nextProps;
        if(this.props.getGroupInfo != getGroupInfo && getGroupInfo){
            this.notShowMember();
        }
    }

    render(){
        if(this.state.memberType == true){
            const {list} = this.props;
            var projectName = this.state.selectRow;
            var groupInfo = this.state.selectGroup;
            var {projectInfo} = this.searchGroupByProjectName(projectName,groupInfo);

            const columns = [
                {title: "项目人员", dataIndex: "name", key: "name"},
                {title: "角色", dataIndex: "role", key: "role"},
                {title: "进入项目时间", dataIndex: "join_time", key: "join_time"},
                {title: "人员状态", dataIndex: "state", key: "state"}
            ];
            const dataSource = [];
            for(var i=0;i<projectInfo.gitlabProjectMember.length;i++){
                if(projectName == projectInfo.gitlabProject.name){
                    dataSource.push({
                        key:i+1,
                        name:projectInfo.gitlabProjectMember[i].name,
                        role:projectInfo.gitlabProjectMember[i].is_admin?"admin":"非admin",
                        join_time:this.transformDate(projectInfo.gitlabProjectMember[i].created_at),
                        state:projectInfo.gitlabProjectMember[i].state
                    });
                }
            }

            return (
                <div className={styles.project_list_div}>
                    <div>
                        <p>项目创建时间:{this.transformDate(projectInfo.gitlabProject.created_at)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目组名称:{groupInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.description}</p>
                    </div>
                    <TableView columns={columns}
                               dataSource={dataSource}
                    ></TableView>

                </div>
            )
        }else{
            return null;
        }
    }
}
ProjectMember.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        list: state.getGroupTree.treeData,
        loginInfo:state.login.profile,
        getGroupInfo:state.getGroupInfo.groupInfo,
    }
}

export default connect(mapStateToProps)(ProjectMember);








