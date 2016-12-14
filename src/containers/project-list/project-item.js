/**
 * Created by Administrator on 2016-09-14.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import 'pubsub-js';
import { Select,Input, Button, message, Tooltip, Row,notification,Table,Modal} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import * as starActions from './actions/consern-project-actions';
import * as fork from '../project-list/actions/fork-project-action';
import {getGroupTree} from '../project-mgr/actions/group-tree-action';
import styles from './index.css';
import ProjectMember from './member';
import {getProjectMembers} from './actions/project-member-action';
import {getProjectInfo} from '../project-mgr/actions/create-project-action';

const Option = Select.Option;

class ProjectItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showProjectMember:false,
            showForkPath:false,
        };
    }

    componentDidMount() {
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(projectInfo){
            this.setState({
                url: projectInfo.sshUrl,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {node,consernedInfo,unconsernInfo} = nextProps;
        if(this.props.node != node && node){
            this.setState({
                showProjectMember:false
            })
        }
        const {loginInfo,projectGroup} = this.props;
        let selectedKey = projectGroup.getGroupInfo?projectGroup.getGroupInfo.node:'';
        if(consernedInfo && this.props.consernedInfo ){
            if(consernedInfo.consernedInfo != this.props.consernedInfo.consernedInfo
            && consernedInfo.consernedInfo){
                this.props.getGroupTree(loginInfo.userId);
                this.props.getProject(selectedKey.id.substr(0,selectedKey.id.length-2),loginInfo.userId);
            }
        }
        if(unconsernInfo && this.props.unconsernInfo){
            if(unconsernInfo.unconsernedInfo != this.props.unconsernInfo.unconsernedInfo
            && unconsernInfo.unconsernedInfo){
                this.props.getGroupTree(loginInfo.userId);
                this.props.getProject(selectedKey.id.substr(0,selectedKey.id.length-2),loginInfo.userId);
            }
        }

        const {forkResult,project} = nextProps;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if (forkResult.forkProject&&this.props.forkResult.forkProject != forkResult.forkProject){
            PubSub.publish("evtRefreshGroupTree",{});
            this.props.getProject(selectedKey.id.substr(0,selectedKey.id.length-2),loginInfo.userId);
            this.setState({
                showForkPath: false,
            });
            message.success('Fork成功!',3);
        }
        // else if(forkResult.errors && this.props.forkResult.errors != forkResult.errors){
        //     // message.error('Fork失败!'+forkResult.errors,3);
        //     this.errorMessage('Fork失败!',forkResult.errors);
        // }

        if(projectInfo){
            this.setState({
                url: projectInfo.sshUrl,
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
        const {actions,loginInfo} = this.props;
        actions.getNamespace(loginInfo.userId);
        this.setState({
            showForkPath: true,
        });
    }

    valueChange(value){
        this.setState({namespace:value});
    }

    handleOk(){
        const {actions,project,loginInfo} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(this.state.namespace){
            actions.forkProject(projectInfo.id,loginInfo.username,this.state.namespace);
        }else{
            message.error('请选择fork项目的namespace',3);
        }

    }

    handleCancel(){
        this.setState({
            showForkPath: false
        });
    }

    getForks(){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const projectId = projectInfo.id;

        this.context.router.push({
            pathname: '/forkList',
            state: {projectId}
        });
    }

    handleChange(value){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(value=='ssh'){
            this.setState({
                value:'ssh',
                url: projectInfo.sshUrl,
            });
        }else{
            this.setState({
                value:'http',
                url: projectInfo.http_url_to_repo,
            });
        }
    }

    concernedChange(is_conserned){
        const {loginInfo,starActions,project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        var starInfo={
            username:null,
            projectId:null,
        };
        starInfo.username = loginInfo.username;
        starInfo.projectId = projectInfo.id;
        if(is_conserned == '关注'){
            starActions.consernProject(starInfo);
        }else{
            starActions.unconsernProject(starInfo);
        }
    }

    memberCountClick(record){
        //调member接口
        const { project } = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        this.props.getProjectMembers(projectInfo.id);
        this.setState({
            showProjectMember:true,
        })
    }

    transformDate(timestamp){
        var newDate = new Date();
        if(timestamp){
            newDate.setTime(timestamp);
            return newDate.toLocaleDateString();
        }else{
            return '';
        }
    }

    getDataSource(){
        const {project} = this.props;
        let dataSource = [];
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(projectInfo ){
            dataSource = [{
                project_name:projectInfo.name,
                description:projectInfo.description,
                memberNum:"共"+projectInfo.member_count+"人",
                current_milestom:this.transformDate(projectInfo.current_mileston_date),
                consern:projectInfo.star_state,
                //state:
                //tech_debt:
                //test_cover:
            }];
        }
        return dataSource;
    }

    render() {
        const {treeData,visible,project,forkResult} = this.props;

        if(visible == true && treeData.length!=0){
            const columns = (self)=>[
                {title: "项目名称", dataIndex: "project_name", key: "project_name"},
                {title: "项目描述", dataIndex: "description", key: "description"},
                {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum",
                    render(text,record){
                        return <a onClick={self.memberCountClick.bind(self,record)}>{text}</a>
                    }
                },
                {title: "当前里程碑结束时间", dataIndex: "current_milestom", key: "current_milestom"},
                {title: "是否关注", dataIndex: "consern", key: "consern",
                    render(text,record){
                        if(text == '关注'){
                            return <a onClick={self.concernedChange.bind(self,text)}>{text}</a>
                        }else if(text == '取消关注'){
                            return <a onClick={self.concernedChange.bind(self,text)}>{text}</a>
                        }else if(text == '项目成员不能取消关注'){
                            return <a onClick={self.concernedChange.bind(self,text)} disabled>{text}</a>
                        }
                    }},
                {title: "项目状态", dataIndex: "state", key: "state"},
                {title: "技术债务", dataIndex: "tech_debt", key: "tech_debt"},
                {title: "单元测试覆盖率", dataIndex: "test_cover", key: "test_cover"},
            ];
            let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
            const dataSource = this.getDataSource();
            const forkFrom =projectInfo&&projectInfo.forks_from?<strong> Forked from {projectInfo.forks_from}</strong>:'';

            const forkPath =forkResult&&forkResult.namespace?forkResult.namespace.map(data => <Option key={data.path}>{data.path}</Option>):[];
            const projectLoading = project.getProjectInfo?project.getProjectInfo.loading:false;

            return (
                <div>
                    <Row>
                        <div className={styles.project_list_div}>
                            <Tooltip placement="top" title={forkFrom}>
                                <Button type="ghost" onClick={this.fork.bind(this)} >Fork</Button>
                            </Tooltip>
                            <span className={styles.arrow}></span>
                            <a className={styles.count} onClick={this.getForks.bind(this)}>{projectInfo?projectInfo.forks_count:''}</a>
                            <Select id="role"  defaultValue="ssh" style={{ width: 60 }} onSelect={this.handleChange.bind(this)}>
                                <Option value="ssh">SSH</Option>
                            </Select>
                            <Input style={{ width: 300 }}  value={this.state.url} type="text" readOnly/>
                            <TableView columns={columns(this)}
                                       dataSource={dataSource}
                                       loading={projectLoading}
                            ></TableView>
                        </div>
                        <Modal title="请选择fork项目的namespace"
                               width="50%"
                               visible={this.state.showForkPath}
                               onOk={this.handleOk.bind(this)}
                               confirmLoading={this.props.forkResult.loading}
                               onCancel={this.handleCancel.bind(this)}
                        >
                            <div style={{paddingLeft:'10px'}}>
                                <span>namespace：</span>
                                <Select id="namespace" onSelect={this.valueChange.bind(this)} style={{ width: 200 }}>
                                    {forkPath}
                                </Select>
                            </div>
                        </Modal>
                    </Row>
                    <Row>
                        {this.state.showProjectMember==true?(
                            <ProjectMember />
                        ):(<div></div>)}
                    </Row>
                </div>
            )
        }else {return null;}
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
        forkResult:state.forkProject,
        consernedInfo:state.consernProject.consernedInfo,
        unconsernInfo:state.consernProject.unconsernInfo,
        project:state.project,
        projectGroup:state.projectGroup,
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(fork,dispatch),
        starActions: bindActionCreators(starActions, dispatch),
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        getProjectMembers:bindActionCreators(getProjectMembers, dispatch),
        getProject:bindActionCreators(getProjectInfo, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectItem);
