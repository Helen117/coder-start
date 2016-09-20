/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'PubSub-js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as listActions from './actions/project-list-actions';
import TableView from '../../components/table';
import styles from './index.css';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.showProjectList = this.showProjectList.bind(this);
        this.state = {
            listType:false,
            itemType:false,
            listNode:null,
            itemNode:null,
        };
    }

    componentDidMount() {
        const {listActions,loginInfo} = this.props;
        listActions.projectList(loginInfo.userName);
        //在此处注册对其他控件发送的消息的响应
        PubSub.subscribe("evtTreeClick",this.showProjectList.bind(this) );
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        PubSub.unsubscribe("evtTreeClick");
    }

    showProjectList(msg,data){
        //将list和item的展示放到一个contain中
        if(data.node.isLeaf == true){
            this.setState({
                listType:false,
                itemType:true,
                itemNode:data.node.name,
            });
        }else{
            this.setState({
                listType:true,
                itemType:false,
                listNode:data.node.name,
            });
        }
    }

    searchGroupByGroupName(groupName,list){
        var groupInfo;
        for(var i=0;i<list.group.length;i++){
            if(groupName == list.group[i].name){
                groupInfo = list.group[i];
                return groupInfo;
            }
        }
    }

    searchGroupByProjectName(projectName,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.group.length;i++){
            for(var j=0;j<list.group[i].childern.length;j++){
                if(projectName == list.group[i].childern[j].gitlabProject.name){
                    groupInfo = list.group[i];
                    projectInfo = list.group[i].childern[j];
                    return {projectInfo,groupInfo}
                }
            }
        }
    }

    render() {
        if(this.state.listType == true){//展示项目列表
            const {list,fetchStatus,loginInfo} = this.props;
            if (fetchStatus || false) {
                var groupName = this.state.listNode;
                var groupInfo = this.searchGroupByGroupName(groupName,list);
                var starInfo = list.star;

                const columns = [
                    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
                    {title: "当前项目经理", dataIndex: "manager", key: "manager"},
                    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum"},
                    {title: "owner", dataIndex: "owner", key: "owner"},
                    {title: "是否关注", dataIndex: "consern", key: "consern",
                        render(text,record){
                            var count = 0;var count2 = 0;
                            for(var i=0;i<starInfo.length;i++){
                                if(record.projectName == starInfo[i].projectName){
                                    count++;
                                    for(var j=0;j<groupInfo.childern.length;j++){
                                        if(record.projectName == groupInfo.childern[j].gitlabProject.name){
                                            if(loginInfo.userName == groupInfo.childern){
                                                count2++;
                                            }
                                        }
                                    }
                                }
                            }
                            if(count == 0){
                                return <a>关注</a>
                            }else if(count2 == 0){
                                return <a >取消关注</a>
                            }else{
                                return <a disabled="true">取消关注</a>
                            }
                        }
                    }
                ];
                const dataSource = [];
                for(var i=0;i<groupInfo.childern.length;i++){
                    dataSource.push({
                        key:i+1,
                        projectName:groupInfo.childern[i].gitlabProject.name,
                        manager:groupInfo.childern[i].gitlabProject.creator_id,
                        memberNum:groupInfo.childern[i].gitlabProjectMember.length,
                        owner:groupInfo.childern[i].gitlabProject.owner
                    });
                }

                return (
                    <div className ={styles.project_list_div}>
                        <div>
                            <p>项目组名称:{groupInfo.name}</p>
                        </div>
                        <TableView columns={columns}
                                   dataSource={dataSource}
                        ></TableView>
                    </div>
                )
            }
            return null;
        }else if(this.state.itemType == true){//展示项目成员信息
            const {list,fetchStatus} = this.props;
            if (fetchStatus || false) {
                var projectName = this.state.itemNode;
                var {projectInfo,groupInfo} = this.searchGroupByProjectName(projectName,list);

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
                            join_time:projectInfo.gitlabProjectMember[i].created_at,
                            state:projectInfo.gitlabProjectMember[i].state
                        });
                    }
                }

                return (
                    <div className={styles.project_list_div}>
                        <div>
                            <p>项目创建时间:{projectInfo.gitlabProject.created_at}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目组名称:{groupInfo.name}</p>
                        </div>
                        <TableView columns={columns}
                                   dataSource={dataSource}
                        ></TableView>

                    </div>
                )
            }
            return null;
        }else {
            return null;
        }
    }
}

function mapStateToProps(state) {
    return {
        list: state.projectList.projectList,
        fetchStatus:state.projectList.fetchStatus,
        loginInfo:state.login.profile,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        listActions: bindActionCreators(listActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);

