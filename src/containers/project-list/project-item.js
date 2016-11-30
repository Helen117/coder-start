/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { Select,Input, Button, message, Tooltip, Row,notification,Table} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import * as starActions from './actions/consern-project-actions';
import * as fork from '../project-list/actions/fork-project-action';
import {getGroupTree} from '../project-mgr/actions/group-tree-action';
import styles from './index.css';
import {searchNormalGroupByProjectId, findMyConsernProject, isConserned, findProjectIdByTreedata} from './util';
import ProjectMember from './member';

const Option = Select.Option;

class ProjectItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showProjectMember:false,
            groupInfo_member:null,
            projectInfo_member:null
        };
    }

    componentDidMount() {
        console.log('componentDidMount')
        if(this.props.getProjectInfo){
            this.setState({
                url: this.props.getProjectInfo.sshUrl,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps')
        //调tabledata接口

        const {node} = nextProps;
        if(this.props.node != node && node){
            this.setState({
                showProjectMember:false
            })
        }
        const {loginInfo,} = this.props;
        const { consernedInfo, unconsernedInfo } = nextProps;
        if (this.props.consernedInfo != consernedInfo && consernedInfo){
            this.props.getGroupTree(loginInfo.userId)
        }else if(this.props.unconsernedInfo != unconsernedInfo && unconsernedInfo){
            this.props.getGroupTree(loginInfo.userId)
        }

        const {forkResult,getProjectInfo} = nextProps;
        if (forkResult.forkProject&&this.props.forkResult.forkProject != forkResult.forkProject){
            PubSub.publish("evtRefreshGroupTree",{});
            message.success('Fork成功!',3);
        }else if(forkResult.errors && this.props.forkResult.errors != forkResult.errors){
            // message.error('Fork失败!'+forkResult.errors,3);
            this.errorMessage('Fork失败!',forkResult.errors);
        }

        if(getProjectInfo){
            this.setState({
                url: getProjectInfo.sshUrl,
            });
        }
    }

    errorMessage(info,error){
        notification.error({
            message: info,
            description:error,
            duration:null,
        });
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
        const {loginInfo,starActions,treeData} = this.props;
        var projectId = '';
        let project_name = consernedProject.project_name;
        for(var i=0;i<groupInfo.children.length;i++){
            if(project_name == groupInfo.children[i].name){
                projectId= groupInfo.children[i].id;
            }
        }
        let p_index = consernedProject.project_name.indexOf("/");
        if(p_index >= 0){
            projectId = findProjectIdByTreedata(project_name,treeData);
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

    memberCountClick(record,groupInfo,projectInfo){
        //调memberData接口

        this.setState({
            showProjectMember:true,
            groupInfo_member:groupInfo,
            projectInfo_member:projectInfo
        })
    }

    getDataSource(starList,groupInfo,projectInfo){
        const {loginInfo, projectMembers} = this.props;
        let consern_desc = isConserned(loginInfo,projectMembers,starList,projectInfo);
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
        return dataSource;
    }

    render() {
        const {treeData,loginInfo,projectMembers,fetchProjectStatus,node,visible} = this.props;
        if(visible == true){
            if((projectMembers.fetchPMStatus || false) && (fetchProjectStatus || false) && treeData.length!=0){
                var projectId = node.id;
                var {projectInfo,groupInfo} = searchNormalGroupByProjectId(projectId,treeData);
                if(projectInfo != ''){
                    let starList = findMyConsernProject(treeData);
                    const columns = (self)=>[
                        {title: "项目组名称", dataIndex: "group_name", key: "group_name"},
                        {title: "项目名称", dataIndex: "project_name", key: "project_name"},
                        {title: "项目描述", dataIndex: "description", key: "description"},
                        {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum",
                            render(text,record){
                                return <a onClick={self.memberCountClick.bind(self,record,groupInfo,projectInfo)}>{text}</a>
                            }
                        },
                        {title: "下一里程碑时间节点", dataIndex: "next_milestom", key: "next_milestom"},
                        {title: "是否关注", dataIndex: "consern", key: "consern",
                            render(text,record){
                                let consern_desc = isConserned(loginInfo,projectMembers,starList,projectInfo);
                                if(consern_desc == '关注'){
                                    return <a onClick={self.concernedChange.bind(self,record,groupInfo,consern_desc)}>{text}</a>
                                }else if(consern_desc == '取消关注'){
                                    return <a onClick={self.concernedChange.bind(self,record,groupInfo,consern_desc)}>{text}</a>
                                }else if(consern_desc == '项目成员禁止取关'){
                                    return <a onClick={self.concernedChange.bind(self,record,groupInfo,consern_desc)} disabled>{text}</a>
                                }
                            }},
                        {title: "项目状态", dataIndex: "state", key: "state"},
                        {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
                        {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
                    ];
                    const dataSource = this.getDataSource(starList,groupInfo,projectInfo);
                    const forkFrom =this.props.getProjectInfo.forksFrom?<strong> Forked from {this.props.getProjectInfo.forksFrom}</strong>:'';

                    return (
                        <div>
                            <Row>
                                <div className={styles.project_list_div}>
                                    <Tooltip placement="top" title={forkFrom}>
                                        <Button type="ghost" onClick={this.fork.bind(this)} loading={this.props.forkResult.loading}>Fork</Button>
                                    </Tooltip>
                                    <span className={styles.arrow}></span>
                                    <a className={styles.count} onClick={this.getForks.bind(this)}>{this.props.getProjectInfo.forksCount}</a>
                                    <Select id="role"  defaultValue="ssh" style={{ width: 60 }} onSelect={this.handleChange.bind(this)}>
                                        <Option value="ssh">SSH</Option>
                                    </Select>
                                    <Input style={{ width: 300 }}  value={this.state.url} type="text" readOnly/>
                                    <TableView columns={columns(this)}
                                               dataSource={dataSource}
                                    ></TableView>
                                </div>
                            </Row>
                            <Row>
                                {this.state.showProjectMember==true?(
                                    <ProjectMember groupInfo={this.state.groupInfo_member}
                                                   projectInfo={this.state.projectInfo_member}
                                        node={node}/>
                                ):(<div></div>)}
                            </Row>
                        </div>
                    )
                }else{
                    const columns = (self)=>[
                        {title: "项目组名称", dataIndex: "group_name", key: "group_name"},
                        {title: "项目名称", dataIndex: "project_name", key: "project_name"},
                        {title: "项目描述", dataIndex: "description", key: "description"},
                        {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum"},
                        {title: "下一里程碑时间节点", dataIndex: "next_milestom", key: "next_milestom"},
                        {title: "是否关注", dataIndex: "consern", key: "consern"},
                        {title: "项目状态", dataIndex: "state", key: "state"},
                        {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
                        {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
                    ];
                    return(<Table style={{padding:'10px 0px 0px 50px'}} columns={columns(this)}></Table>)
                }
            }else{
                return null;
            }
        }
        return null;
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
        treeData: state.getGroupTree.treeData,
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


