/**
 * Created by Administrator on 2016-09-27.
 */
/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {Switch,Icon, Row, Col} from 'antd';
import 'pubsub-js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as starActions from './actions/consern-project-actions';
import {getProjectStar} from '../project-mgr/actions/project-star-action';
import TableView from '../../components/table';
import styles from './index.css';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.showProjectList = this.showProjectList.bind(this);
        this.state = {
            listType:false,
            nullType:false,
            listNode:null,
        };
    }

    componentDidMount() {
        //在此处注册对其他控件发送的消息的响应
        //PubSub.subscribe("evtTreeClick",this.showProjectList.bind(this) );
        const {node} = this.props.location.state;
        if(node){
            this.showProjectList(node);
        }
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        //PubSub.unsubscribe("evtTreeClick");
    }

    showProjectList(data){
        if(data.isLeaf == false && (data.id.indexOf("_p") < 0)){
            this.setState({
                listType:true,
                listNode:data.id,
            });
        }else if(data.isLeaf == true && (data.id.indexOf("_p") < 0)){
            this.setState({
                listType:false,
                nullType:true,
            });
        }else{
            this.setState({
                listType:false,
                nullType:false,
            });
        }
    }

    searchGroupByGroupName(groupId,list){
        var groupInfo;
        for(var i=0;i<list.length;i++){
            if(groupId == list[i].id){
                groupInfo = list[i];
                return groupInfo;
            }
        }
    }

    concernedChange(consernedProject,groupInfo,is_conserned){
        const {loginInfo,starActions,} = this.props;
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
        if(is_conserned == '关注'){
            starActions.consernProject(starInfo);
        }else{
            starActions.unconsernProject(starInfo);
        }
    }

    memberCountClick(record,groupInfo){
        this.context.router.push({
            pathname: '/project-mgr/project-list/project-member',
            state: {record:record, groupInfo:groupInfo}
        });
    }

    componentWillReceiveProps(nextProps) {
        const {node} = nextProps.location.state;
        if(node){
            this.showProjectList(node);
        }
        const {loginInfo,} = this.props;
        const { consernedInfo, unconsernedInfo } = nextProps;
        if (this.props.consernedInfo != consernedInfo && consernedInfo){
            this.props.getProjectStar(loginInfo.username);
        }else if(this.props.unconsernedInfo != unconsernedInfo && unconsernedInfo){
            this.props.getProjectStar(loginInfo.username);
        }
    }

    render() {
        if(this.state.listType == true){//展示项目组信息
            const {list,loginInfo,groupMembers,fetchGroupMembers,fetchProjectStar,starList} = this.props;
            if (fetchProjectStar || false) {
                var groupId = this.state.listNode;
                var groupInfo = this.searchGroupByGroupName(groupId,list);

                const dataSource = [];
                for(var i=0;i<groupInfo.children.length;i++){
                    var manager = '';
                    if(fetchGroupMembers || false){
                        for(var j=0;j<groupMembers.length;j++){
                            if(groupInfo.children[i].gitlabProject.creator_id == groupMembers[j].id){
                                manager = groupMembers[j].name;
                            }
                        }
                    }
                    var count = 0, count2 = 0,recordPrijectId='';
                    recordPrijectId = groupInfo.children[i].gitlabProject.id;
                    for(var j=0;j<groupInfo.children[i].gitlabProjectMember.length;j++){
                        if(loginInfo.username == groupInfo.children[i].gitlabProjectMember[j].username){
                            count2++;//当前用户是此项目下成员
                        }
                    }
                    for(var j=0;j<starList.length;j++){
                        if(recordPrijectId == starList[j].id){
                            count++;
                        }
                    }
                    var is_conserned;
                    if(count == 0 && count2 == 0){//未关注
                        is_conserned = '关注';
                    }else if(count != 0 && count2 == 0){//已关注
                        is_conserned = '取消关注';
                    }else{//项目成员
                        is_conserned = '项目成员禁止取关';
                    }
                    dataSource.push({
                        key:i+1,
                        projectName:groupInfo.children[i].name,
                        manager:manager,
                        memberNum:"共"+groupInfo.children[i].gitlabProjectMember.length+"人",
                        owner:groupInfo.children[i].gitlabProject.owner,
                        consern:is_conserned
                    });
                }
                const groupColumns = (self)=>[
                    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
                    {title: "当前项目经理", dataIndex: "manager", key: "manager"},
                    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum",
                        render(text,record){
                            return <a onClick={self.memberCountClick.bind(self,record,groupInfo)}>{text}</a>
                        }
                    },
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
                                var is_conserned = '关注';
                                return <a onClick={self.concernedChange.bind(self,record,groupInfo,is_conserned)}>{text}</a>
                            }else if(count != 0 && count2 == 0){//已关注
                                var is_conserned = '取消关注';
                                return <a onClick={self.concernedChange.bind(self,record,groupInfo,is_conserned)}>{text}</a>
                            }else{//项目成员
                                var is_conserned = '项目成员禁止取关';
                                return <a onClick={self.concernedChange.bind(self,record,groupInfo,is_conserned)} disabled>{text}</a>
                            }
                        }
                    }
                ];
                return (
                    <div>
                        <Row>
                            <div className ={styles.project_list_div}>
                                <div>
                                    <p>项目组名称:{groupInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建人：{groupInfo.owner}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.description}</p>
                                </div>
                                <TableView columns={groupColumns(this)}
                                           dataSource={dataSource}
                                ></TableView>
                            </div>
                        </Row>
                        <Row>
                            {this.props.children}
                        </Row>
                    </div>
                )
            }
            return null;
        } else if(this.state.nullType == true){
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

ProjectList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        groupMembers:state.getGroupMembers.groupMembers,
        fetchGroupMembers:state.getGroupMembers.fetchStatus,
        fetchProjectStar:state.getProjectStar.fetchStatus,
        starList:state.getProjectStar.starList,
        list: state.getGroupTree.treeData,
        consernedInfo:state.consernProject.consernedInfo,
        unconsernedInfo:state.unconsernProject.unconsernedInfo,
        getGroupInfo:state.getGroupInfo.groupInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        starActions: bindActionCreators(starActions, dispatch),
        getProjectStar:bindActionCreators(getProjectStar, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);

