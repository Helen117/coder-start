/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { Select,Input, Button, message} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import * as fork from '../project-list/actions/fork-project-action';
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
        PubSub.subscribe("evtTreeClick",this.showProjectItem.bind(this) );
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        PubSub.unsubscribe("evtTreeClick");
    }

    showProjectItem(msg,data){
        if(data.isLeaf == true && data.id.indexOf("_p") > 0){
            this.setState({
                itemType:true,
                itemNode:data.id.replace("_p",""),
            });
        }else{
            this.setState({
                itemType:false,
                itemNode:null,
            });
        }
    }

    searchGroupByProjectName(projectId,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                if(projectId == list[i].children[j].gitlabProject.id){
                    groupInfo = list[i];
                    projectInfo = list[i].children[j];
                    return {projectInfo,groupInfo}
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
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

        if(getProjectInfo && this.getProjectInfo!=getProjectInfo){
            if(this.state.value=='ssh'){
                this.setState({
                    url: getProjectInfo.gitlabProject.ssh_url_to_repo,
                });
            }else {
                this.setState({
                    url: getProjectInfo.gitlabProject.http_url_to_repo,
                });
            }
        }

    }

    fork(){
        const {actions,getProjectInfo,loginInfo} = this.props;
       // console.log('actions:',getProjectInfo);
        actions.forkProject(getProjectInfo.gitlabProject.id,loginInfo.username);
    }
    handleChange(value){
        const {getProjectInfo} = this.props;
        if(value=='ssh'){
            this.setState({
                value:'ssh',
                url: getProjectInfo.gitlabProject.ssh_url_to_repo,
            });
        }else{
            this.setState({
                value:'http',
                url: getProjectInfo.gitlabProject.http_url_to_repo,
            });
        }

    }

    render() {
        if(this.state.itemType == true){//展示项目信息
            const {list,loginInfo,fetchProjectStar,starList} = this.props;

            if(fetchProjectStar || false){
                var projectId = this.state.itemNode;
                var {projectInfo,groupInfo} = this.searchGroupByProjectName(projectId,list);
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
                for(var i=0;i<groupInfo.children.length;i++){
                    if(projectInfo.name == groupInfo.children[i].gitlabProject.name){
                        for(var j=0;j<groupInfo.children[i].gitlabProjectMember.length;j++){
                            if(loginInfo.username == groupInfo.children[i].gitlabProjectMember[j].username){
                                count2++;//当前用户是此项目下成员
                            }
                        }
                    }
                }
                for(var j=0;j<starList.length;j++){
                    if(projectInfo.id == starList[j].id){
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
                    project_name:projectInfo.name,
                    //next_milestom:
                    consern:consern_desc,
                    //state:
                    //tech_debt:
                    //test_cover:
                }];

                return (
                    <div className={styles.project_list_div}>
                        <Button type="ghost" onClick={this.fork.bind(this)} loading={this.props.forkResult.loading}>Fork</Button>
                        <Select id="role"  defaultValue="ssh" style={{ width: 60 }} onChange={this.handleChange.bind(this)}>
                            <Option value="ssh">SSH</Option>
                            <Option value="http">HTTP</Option>
                        </Select>
                        <Input style={{ width: 300 }}  value={this.state.url}/>
                        <TableView columns={columns}
                                   dataSource={dataSource}
                        ></TableView>
                    </div>
                )
            }
            return null;
        }else{
            return null;
        }
    }
}

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        fetchProjectStar:state.getProjectStar.fetchStatus,
        starList:state.getProjectStar.starList,
        list: state.getGroupTree.treeData,
        getProjectInfo:state.getProjectInfo.projectInfo,
        forkResult:state.forkProject,
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(fork,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectItem);

