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
        const {listActions} = this.props;
        listActions.projectList();
        //在此处注册对其他控件发送的消息的响应
        PubSub.subscribe("evtTreeClick",this.showProjectList.bind(this) );
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        PubSub.unsubscribe("evtTreeClick");
    }

    showProjectList(msg,data){
        var count = 0;
        const {list} = this.props;
        for(var i=0;i<list.result.length;i++){
            if(data.selectedKeys != list.result[i].name){
                count++;
            }
        }//将list和item的展示放到一个contain中
        if(count == list.result.length){
            this.setState({
                listType:false,
                itemType:true,
                itemNode:data.selectedKeys,
            });
        }else{
            this.setState({
                listType:true,
                itemType:false,
                listNode:data.selectedKeys,
            });
        }
    }

    searchGroupByGroupName(groupName,list){
        var groupInfo;
        for(var i=0;i<list.result.length;i++){
            if(groupName == list.result[i].name){
                groupInfo = list.result[i];
                return groupInfo;
            }
        }
    }

    searchGroupByProjectName(projectName,list){
        var groupInfo;
        for(var i=0;i<list.result.length;i++){
            for(var j=0;j<list.result[i].childern.length;j++){
                if(projectName == list.result[i].childern[j].name){
                    groupInfo = list.result[i];
                    return {groupInfo}
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

                const columns = [
                    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
                    {title: "当前项目经理", dataIndex: "manager", key: "manager"},
                    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum"},
                    {title: "owner", dataIndex: "owner", key: "owner"},
                    /*{title: "是否关注", dataIndex: "consern", key: "consern",
                        render(text,record){
                            for(var i=0;i<list.projectList.member.length;i++){
                                if(loginInfo.userName == list.projectList.member[i].userName
                                    && list.projectList.member[i].project_name == record.projectName){
                                    return <a disabled="true">取消关注</a>
                                }else {
                                    return <a>关注</a>
                                }
                            }
                        }
                    }*/
                ];
                const dataSource = [];
                for(var i=0;i<groupInfo.childern.length;i++){
                    dataSource.push({
                        key:i+1,
                        projectName:groupInfo.childern[i].name,
                        //manager:groupInfo.childern[i].manager,
                        //memberNum:groupInfo.childern[i].member_num,
                        owner:groupInfo.childern[i].owner
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
                var groupInfo = this.searchGroupByProjectName(projectName,list);

                const columns = [
                    {title: "项目人员", dataIndex: "userName", key: "userName"},
                    {title: "角色", dataIndex: "role", key: "role"},
                    {title: "进入项目时间", dataIndex: "join_time", key: "join_time"},
                    {title: "人员状态", dataIndex: "status", key: "status"}
                ];
                const dataSource = [];
                for(var i=0;i<list.result.length;i++){
                    if(projectName == list.result[i].project_name){
                        dataSource.push({
                            key:i+1,
                            userName:list.result[i].userName,
                            role:list.result[i].role_id,
                            join_time:list.result[i].join_time,
                            status:list.result[i].status
                        });
                    }
                }

                return (
                    <div className={styles.project_list_div}>
                        <div>
                            <p>项目创建时间:{projectInfo.create_time}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目组名称:{groupName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.create_for}</p>
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

