/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {Switch,Icon} from 'antd';
import 'pubsub-js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as starActions from './actions/consern-project-actions';
import TableView from '../../components/table';
import styles from './index.css';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.showProjectList = this.showProjectList.bind(this);
        this.state = {
            listType:false,
            itemType:false,
            nullType:false,
            listNode:null,
            itemNode:null,
        };
    }

    componentDidMount() {
        //在此处注册对其他控件发送的消息的响应
        PubSub.subscribe("evtTreeClick",this.showProjectList.bind(this) );
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        PubSub.unsubscribe("evtTreeClick");
    }

    showProjectList(msg,data){
        //将list和item的展示放到一个contain中
        if(data.isLeaf == true && (data.id.indexOf("_p") > 0)){
            this.setState({
                listType:false,
                itemType:true,
                itemNode:data.name,
            });
        }else if(data.isLeaf == false && (data.id.indexOf("_p") < 0)){
            this.setState({
                listType:true,
                itemType:false,
                listNode:data.name,
            });
        }else if(data.isLeaf == true && (data.id.indexOf("_p") < 0)){
            this.setState({
                listType:false,
                itemType:false,
                nullType:true,
            });
        }
    }

    searchGroupByGroupName(groupName,list){
        var groupInfo;
        for(var i=0;i<list.length;i++){
            if(groupName == list[i].name){
                groupInfo = list[i];
                return groupInfo;
            }
        }
    }

    searchGroupByProjectName(projectName,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                if(projectName == list[i].children[j].gitlabProject.name){
                    groupInfo = list[i];
                    projectInfo = list[i].children[j];
                    return {projectInfo,groupInfo}
                }
            }
        }
    }

    onSelectRow(groupInfo,record){
        PubSub.publish("evtRowClick",{record:record, groupInfo:groupInfo});
    }

    concernedChange(consernedProject,groupInfo,is_conserned){
        const {loginInfo,starActions} = this.props;
        var projectId = '';
        for(var i=0;i<groupInfo.children.length;i++){
            if(consernedProject.projectName == groupInfo.children[i].name){
                projectId= groupInfo.children[i].gitlabProject.id;
            }
        }
        var starInfo={
            username:null,
            projectId:null,
        };
        starInfo.username = loginInfo.username;
        starInfo.projectId = projectId;
        if(is_conserned == 'no'){
            starActions.consernProject(starInfo);
        }else{
            starActions.unconsernProject(starInfo);
        }
    }

    render() {
        if(this.state.listType == true){//展示项目组信息
            const {list,loginInfo,groupMembers,fetchGroupMembers,fetchProjectStar,starList} = this.props;
            if ((fetchGroupMembers || false) && (fetchProjectStar || false)) {
                var groupName = this.state.listNode;
                var groupInfo = this.searchGroupByGroupName(groupName,list);
                //var starInfo = groupInfo.star;

                const dataSource = [];
                for(var i=0;i<groupInfo.children.length;i++){
                    var manager = '';
                    for(var j=0;j<groupMembers.length;j++){
                        if(groupInfo.children[i].gitlabProject.creator_id == groupMembers[j].id){
                            manager = groupMembers[j].name;
                        }
                    }
                    dataSource.push({
                        key:i+1,
                        projectName:groupInfo.children[i].gitlabProject.name,
                        manager:manager,
                        memberNum:groupInfo.children[i].gitlabProjectMember.length,
                        owner:groupInfo.children[i].gitlabProject.owner
                    });
                }
                const groupColumns = (self)=>[
                    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
                    {title: "当前项目经理", dataIndex: "manager", key: "manager"},
                    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum"},
                    {title: "owner", dataIndex: "owner", key: "owner"},
                    {title: "是否关注", dataIndex: "consern", key: "consern",
                        render(text,record){
                            var count = 0, count2 = 0,recordPrijectId='';
                            for(i=0;i<groupInfo.children.length;i++){
                                if(record.projectName == groupInfo.children[i].gitlabProject.name){
                                    recordPrijectId = groupInfo.children[i].gitlabProject.id;
                                    for(var j=0;j<groupInfo.children[i].gitlabProjectMember.length;j++){
                                        if(loginInfo.username == groupInfo.children[i].gitlabProjectMember[j].username){
                                            count2++;//当前用户是此项目下成员
                                        }
                                    }
                                }
                            }
                            for(var j=0;j<starList.length;j++){
                                if(recordPrijectId == starList[j].id){
                                    count++;
                                }
                            }
                            if(count == 0 && count2 == 0){//未关注
                                var is_conserned = 'no';
                                return <Switch checkedChildren="是" unCheckedChildren="否"
                                               onChange={self.concernedChange.bind(self,record,groupInfo,is_conserned)}/>
                            }else if(count != 0 && count2 == 0){//已关注
                                var is_conserned = 'yes';
                                return <Switch checkedChildren="是" unCheckedChildren="否"
                                               defaultChecked="true"
                                               onChange={self.concernedChange.bind(self,record,groupInfo,is_conserned)}/>
                            }else{//项目成员
                                var is_conserned = 'yes';
                                return <Switch disabled checkedChildren="是" unCheckedChildren="否"
                                               defaultChecked="true"
                                               onChange={self.concernedChange.bind(self,record,groupInfo,is_conserned)}/>
                            }
                        }
                    }
                ];
                return (
                    <div className ={styles.project_list_div}>
                        <div>
                            <p>项目组名称:{groupInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建人：{groupInfo.owner}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.description}</p>
                        </div>
                        <TableView columns={groupColumns(this)}
                                   dataSource={dataSource}
                                   onSelectRow={this.onSelectRow.bind(this,groupInfo)}
                        ></TableView>
                    </div>
                )
            }
            return null;
        }else if(this.state.itemType == true){//展示项目信息
            const {list,loginInfo,fetchProjectStar,starList} = this.props;
            if(fetchProjectStar || false){
                var projectName = this.state.itemNode;
                var {projectInfo,groupInfo} = this.searchGroupByProjectName(projectName,list);
                //var starInfo = groupInfo.star;
                const columns = [
                    {title: "项目组名称", dataIndex: "group_name", key: "group_name"},
                    {title: "项目名称", dataIndex: "project_name", key: "project_name"},
                    {title: "下一里程碑时间节点", dataIndex: "next_milestom", key: "next_milestom"},
                    {title: "是否关注", dataIndex: "consern", key: "consern"},
                    {title: "项目状态", dataIndex: "state", key: "state"},
                    {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
                    {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
                ];
                var count=0, count2=0;
                for(i=0;i<groupInfo.children.length;i++){
                    if(projectInfo.name == groupInfo.children[i].gitlabProject.name){
                        for(var j=0;j<groupInfo.children[i].gitlabProjectMember.length;j++){
                            if(loginInfo.username == groupInfo.children[i].gitlabProjectMember[j].username){
                                count2++;//当前用户是此项目下成员
                            }
                        }
                    }
                }
                for(var j=0;j<starList.length;j++){
                    if(projectInfo.name == starList[j].name){
                        count++;
                    }
                }
                if(count == 0 && count2 == 0){//未关注
                    var consern_desc = "尚未关注此项目";
                }else if(count2 == 0){//已关注
                    var consern_desc = "我关注了这个项目";
                }else{//项目成员
                    var consern_desc = "我是项目成员";
                }
                const dataSource = [{
                    group_name:groupInfo.name,
                    project_name:projectName,
                    //next_milestom:
                    consern:consern_desc,
                    //state:
                    //tech_debt:
                    //test_cover:
                }];

                return (
                    <div className={styles.project_list_div}>
                        <TableView columns={columns}
                                   dataSource={dataSource}
                        ></TableView>
                    </div>
                )
            }
             return null;
        }else if(this.state.nullType == true){
            return(
                <div className={styles.null_type_div}>
                    <span><Icon type="frown-circle" />&nbsp;&nbsp;&nbsp;当前项目组下没有项目！</span>
                </div>
            )
        }else{
            return null;
        }
    }
}

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        groupMembers:state.getGroupMembers.groupMembers,
        fetchGroupMembers:state.getGroupMembers.fetchStatus,
        fetchProjectStar:state.getProjectStar.fetchStatus,
        starList:state.getProjectStar.starList,
        list: state.getGroupTree.treeData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        starActions: bindActionCreators(starActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);

