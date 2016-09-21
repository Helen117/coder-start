/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {Switch} from 'antd';
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

    onSelectRow(record){
        PubSub.publish("evtRowClick",{record:record});
    }

    render() {
        if(this.state.listType == true){//展示项目组信息
            const {list,fetchStatus,loginInfo} = this.props;
            if (fetchStatus || false) {
                var groupName = this.state.listNode;
                var groupInfo = this.searchGroupByGroupName(groupName,list);
                var starInfo = groupInfo.star;

                const columns = [
                    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
                    {title: "当前项目经理", dataIndex: "manager", key: "manager"},
                    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum"},
                    {title: "owner", dataIndex: "owner", key: "owner"},
                    {title: "是否关注", dataIndex: "consern", key: "consern",
                        render(text,record){
                            var count = 0, count2 = 0;
                            for(var i=0;i<starInfo.length;i++){
                                if(record.projectName == starInfo[i].projectName){
                                    count++;
                                    for(var j=0;j<groupInfo.children.length;j++){
                                        if(record.projectName == groupInfo.children[j].gitlabProject.name){
                                            if(loginInfo.userName == groupInfo.children[j].gitlabProjectMember.name){
                                                count2++;
                                            }
                                        }
                                    }
                                }
                            }
                            if(count == 0){
                                return <Switch checkedChildren="是" unCheckedChildren="否" />
                            }else if(count2 == 0){
                                return <Switch checkedChildren="否" unCheckedChildren="是" />
                            }else{
                                return <Switch disabled checkedChildren="否" unCheckedChildren="是" />
                            }
                        }
                    }
                ];
                const dataSource = [];
                for(var i=0;i<groupInfo.children.length;i++){
                    dataSource.push({
                        key:i+1,
                        projectName:groupInfo.children[i].gitlabProject.name,
                        manager:groupInfo.children[i].gitlabProject.creator_id,
                        memberNum:groupInfo.children[i].gitlabProjectMember.length,
                        owner:groupInfo.children[i].gitlabProject.owner
                    });
                }
                return (
                    <div className ={styles.project_list_div}>
                        <div>
                            <p>项目组名称:{groupInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.description}</p>
                        </div>
                        <TableView columns={columns}
                                   dataSource={dataSource}
                                   onSelectRow={this.onSelectRow.bind(this)}
                        ></TableView>
                    </div>
                )
            }
            return null;
        }else if(this.state.itemType == true){//展示项目信息
            const {list,fetchStatus,loginInfo} = this.props;
             if (fetchStatus || false) {
             var projectName = this.state.itemNode;
             var {projectInfo,groupInfo} = this.searchGroupByProjectName(projectName,list);
　　　　　　 var starInfo = groupInfo.star;
             const columns = [
             {title: "项目组名称", dataIndex: "group_name", key: "group_name"},
             {title: "项目名称", dataIndex: "project_name", key: "project_name"},
             {title: "下一里程碑时间节点", dataIndex: "next_milestom", key: "next_milestom"},
             {title: "是否关注", dataIndex: "consern", key: "consern"},
             {title: "项目状态", dataIndex: "state", key: "state"},
             {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
             {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
             ];
             var count1=0, count2=0;
             for(var i=0;i<starInfo.length;i++){
                if(projectName == starInfo[i].projectName){
                    count1++;
                    for(var j=0;j<projectInfo.gitlabProjectMember.length;j++){
                        console.log("loginInfo.userName:",loginInfo.userName);
                        console.log("projectInfo.gitlabProjectMember[j].name:",projectInfo.gitlabProjectMember[j].name);
                        if(loginInfo.userName == projectInfo.gitlabProjectMember[j].name){
                            count2++;
                         }
                         console.log("count2:",count2);
                    }
                }
             }
             if(count1 == 0){
                 var consern_desc = "尚未关注此项目";
             }else if(count2 == 0){
                 var consern_desc = "我关注了这个项目";
             }else if(count2 != 0){
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

