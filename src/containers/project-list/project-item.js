/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { Select,Input, Button, message, Row} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import * as starActions from './actions/consern-project-actions';
import {getProjectStar} from '../project-mgr/actions/project-star-action';
import * as fork from '../project-list/actions/fork-project-action';
import {getGroupTree} from '../project-mgr/actions/group-tree-action';
import styles from './index.css';

const Option = Select.Option;

class ProjectItem extends Component {
    constructor(props) {
        super(props);
        this.showProjectItem = this.showProjectItem.bind(this);
        this.state = {
            itemType:false,
            itemNode:null,
        };
    }

    componentDidMount() {
        //在此处注册对其他控件发送的消息的响应
        //PubSub.subscribe("evtTreeClick",this.showProjectItem.bind(this) );
        const {node} = this.props.location.state;
        if(node){
            this.showProjectItem(node);
        }

        if(this.props.getProjectInfo){
            this.setState({
                url: this.props.getProjectInfo.sshUrl,
            });
        }
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        //PubSub.unsubscribe("evtTreeClick");
    }

    showProjectItem(data){
        if(data.isLeaf == true && (data.id.indexOf("_") >= 0 && data.id.indexOf("_g") < 0)){
            this.setState({
                itemType:true,
                itemNode:data.id,
            });
        }else{
            this.setState({
                itemType:false,
                itemNode:null,
            });
        }
    }

    searchGroupByProjectId(projectId,list){
        let groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                var project_cat = list[i].children[j];
                for(var k=0; k<project_cat.children.length; k++){
                    let groupId = project_cat.children[k].id;
                    if(projectId == groupId.substr(0,groupId.length-2)){
                        if((project_cat.id>0)||(project_cat.id.indexOf("_g")>0)){
                            groupInfo = project_cat;
                            return groupInfo;
                        }else{
                            continue;
                        }
                    }
                }
            }
        }
    }

    searchGroupByProjectName(projectId,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                var project_cat = list[i].children[j];
                for(var k=0; k<project_cat.children.length; k++){
                    if(projectId == project_cat.children[k].id){
                        projectInfo = project_cat.children[k];
                        if((project_cat.id>0)||(project_cat.id.indexOf("_g")>0)){
                            groupInfo = project_cat;
                            return {projectInfo,groupInfo}
                        }else{
                            groupInfo = this.searchGroupByProjectId(projectId.substr(0,projectId.length-2),list);
                            return {projectInfo,groupInfo}
                        }
                    }
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {node} = nextProps.location.state;
        if(node){
            this.showProjectItem(node);
        }
        const {loginInfo,} = this.props;
        const { consernedInfo, unconsernedInfo } = nextProps;
        if (this.props.consernedInfo != consernedInfo && consernedInfo){
            this.props.getGroupTree(loginInfo.userId)
            //this.props.getProjectStar(loginInfo.username);
        }else if(this.props.unconsernedInfo != unconsernedInfo && unconsernedInfo){
            this.props.getGroupTree(loginInfo.userId)
            //this.props.getProjectStar(loginInfo.username);
        }

        const {forkResult,getProjectInfo} = nextProps;

        if (forkResult.forkProject&&this.props.forkResult.forkProject != forkResult.forkProject){
            PubSub.publish("evtRefreshGroupTree",{});
            this.setState({
                itemType:false,
                itemNode:null,
            });
            message.success('Fork成功!',3);
        }else if(forkResult.errors && this.props.forkResult.errors != forkResult.errors){
            message.error('Fork失败!'+forkResult.errors,3);
        }

        if(getProjectInfo){
            // if(this.state.value=='http'){
            //     this.setState({
            //         url: getProjectInfo.http_url_to_repo,
            //     });
            // }else {
            this.setState({
                url: getProjectInfo.sshUrl,
            });
            // }
        }
    }

    fork(){
        const {actions,getProjectInfo,loginInfo} = this.props;
        actions.forkProject(getProjectInfo.id,loginInfo.username);
    }

    getForks(){
        const {getProjectInfo} = this.props;
        const projectId = getProjectInfo.id;

        this.context.router.push({
            pathname: '/forkList',
            state: {projectId}
        });
    }

    handleChange(value){
        const {getProjectInfo} = this.props;
        if(value=='ssh'){
            this.setState({
                value:'ssh',
                url: getProjectInfo.sshUrl,
            });
        }else{
            this.setState({
                value:'http',
                url: getProjectInfo.http_url_to_repo,
            });
        }
    }

    concernedChange(consernedProject,groupInfo,is_conserned){
        const {loginInfo,starActions,} = this.props;
        var projectId = '';
        let p_index = consernedProject.project_name.indexOf("/");
        let project_name = consernedProject.project_name;
        if(p_index >= 0){
            project_name = project_name.substr(p_index+1,project_name.length);
        }
        for(var i=0;i<groupInfo.children.length;i++){
            if(project_name == groupInfo.children[i].name){
                projectId= groupInfo.children[i].id;
            }
        }
        var starInfo={
            username:null,
            projectId:null,
        };
        starInfo.username = loginInfo.username;
        starInfo.projectId = projectId.substr(0,projectId.length-2);
        if(is_conserned == '关注'){
            starActions.consernProject(starInfo);
        }else{
            starActions.unconsernProject(starInfo);
        }
    }

    memberCountClick(record,groupInfo){
        this.context.router.push({
            pathname: '/project-mgr/project-item/project-member',
            state: {record:record, groupInfo:groupInfo}
        });
    }

    findMyConsernProject(list){
        let starList;
        for(let i=0; i<list[0].children.length; i++){
            if(list[0].children[i].name == "我关注的"){
                starList = list[0].children[i].children;
                return starList;
            }
        }
    }

    render() {
        if(this.state.itemType == true){//展示项目信息
            const {list,loginInfo,projectMembers,fetchProjectStatus} = this.props;
            if((projectMembers.fetchPMStatus || false) && (fetchProjectStatus || false) && list.length!=0){
                var projectId = this.state.itemNode;
                var {projectInfo,groupInfo} = this.searchGroupByProjectName(projectId,list);
                let starList = this.findMyConsernProject(list);
                const columns = (self)=>[
                    {title: "项目组名称", dataIndex: "group_name", key: "group_name"},
                    {title: "项目名称", dataIndex: "project_name", key: "project_name"},
                    {title: "项目描述", dataIndex: "description", key: "description"},
                    {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum",
                        render(text,record){
                            return <a onClick={self.memberCountClick.bind(self,record,groupInfo)}>{text}</a>
                        }
                    },
                    {title: "下一里程碑时间节点", dataIndex: "next_milestom", key: "next_milestom"},
                    {title: "是否关注", dataIndex: "consern", key: "consern",
                        render(text,record){
                            var count = 0, count2 = 0,recordPrijectId=projectId;
                            for(var i=0; i<projectMembers.projectMembers.length; i++){
                                if(loginInfo.username == projectMembers.projectMembers[i].username){
                                    count2++;//当前用户是此项目下成员
                                }
                            }
                            for(var j=0;j<starList.length;j++){
                                if(recordPrijectId.substr(0,recordPrijectId.length-2) == starList[j].id.substr(0,starList[j].id.length-2)){
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
                        }},
                    {title: "项目状态", dataIndex: "state", key: "state"},
                    {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
                    {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
                ];
                var count=0, count2=0;
                for(var i=0; i<projectMembers.projectMembers.length; i++){
                    if(loginInfo.username == projectMembers.projectMembers[i].username){
                        count2++;//当前用户是此项目下成员
                    }
                }
                for(var j=0;j<starList.length;j++){
                    var project_id = projectInfo.id;
                    if(project_id.substr(0,project_id.length-2) == starList[j].id.substr(0,starList[j].id.length-2)){
                        count++;
                    }
                }
                if(count == 0 && count2 == 0){//未关注
                    var consern_desc = "关注";
                }else if(count != 0 && count2 == 0){//已关注
                    var consern_desc = "取消关注";
                }else{//项目成员
                    var consern_desc = "项目成员禁止取关";
                }
                const dataSource = [{
                    group_name:groupInfo.name,
                    project_name:projectInfo.name,
                    description:projectInfo.description,
                    memberNum:"共"+projectMembers.projectMembers.length+"人",
                    //next_milestom:
                    consern:consern_desc,
                    //state:
                    //tech_debt:
                    //test_cover:
                }];

                const forkFrom =this.props.getProjectInfo.forksFrom?<strong> Forked from {this.props.getProjectInfo.forksFrom}</strong>:null;

                return (
                    <div>
                        <Row>
                            <div className={styles.project_list_div}>
                                <Button type="ghost" onClick={this.fork.bind(this)} loading={this.props.forkResult.loading}>Fork</Button>
                                <span className={styles.arrow}></span>
                                <a className={styles.count} onClick={this.getForks.bind(this)}>{this.props.getProjectInfo.forksCount}</a>
                                <Select id="role"  defaultValue="ssh" style={{ width: 60 }} onChange={this.handleChange.bind(this)}>
                                    <Option value="ssh">SSH</Option>
                                </Select>
                                <Input style={{ width: 300 }}  value={this.state.url}/>
                                {forkFrom}
                                <TableView columns={columns(this)}
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
        }else{
            return null;
        }
    }
}

ProjectItem.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        list: state.getGroupTree.treeData,
        getProjectInfo:state.getProjectInfo.projectInfo,
        forkResult:state.forkProject,
        projectMembers:state.getProjectMembers,
        consernedInfo:state.consernProject.consernedInfo,
        unconsernedInfo:state.unconsernProject.unconsernedInfo,
        fetchProjectStatus:state.getProjectInfo.fetchProjectStatus
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(fork,dispatch),
        starActions: bindActionCreators(starActions, dispatch),
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectItem);

