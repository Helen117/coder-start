/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import {connect} from 'react-redux';
import TableView from '../../components/table';
import styles from './index.css';

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
        /*const {node} = this.props.location.state;
        console.log("node:",node);
        if(node){
            this.showProjectItem(node);
        }*/
    }

    componentWillMount(){
        //在此处注销对其他控件发送消息的响应
        //PubSub.unsubscribe("evtTreeClick");
    }

    showProjectItem(data){
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

    componentWillReceiveProps(nextProps){
        //const {node} = this.props.location.state;
        const {node} = nextProps.location.state;
        if(node){
            this.showProjectItem(node);
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

ProjectItem.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        fetchProjectStar:state.getProjectStar.fetchStatus,
        starList:state.getProjectStar.starList,
        list: state.getGroupTree.treeData,
        getProjectInfo:state.getProjectInfo.projectInfo,
    }
}

export default connect(mapStateToProps)(ProjectItem);

