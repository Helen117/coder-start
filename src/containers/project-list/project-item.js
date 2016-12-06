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
import {getProjectMembers} from '../project-mgr/actions/project-members-action';
import {getProjectInfo} from '../project-mgr/actions/select-treenode-action';

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
        if(this.props.getProjectInfo){
            this.setState({
                url: this.props.getProjectInfo.sshUrl,
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
        const {loginInfo,selectNodeKey} = this.props;
        if(consernedInfo && this.props.consernedInfo ){
            if(consernedInfo.consernedInfo != this.props.consernedInfo.consernedInfo
            && consernedInfo.consernedInfo){
                this.props.getGroupTree(loginInfo.userId);
                this.props.getProject(selectNodeKey.substr(0,selectNodeKey.length-2),loginInfo.userId);
            }
        }
        if(unconsernInfo && this.props.unconsernInfo){
            if(unconsernInfo.unconsernedInfo != this.props.unconsernInfo.unconsernedInfo
            && unconsernInfo.unconsernedInfo){
                this.props.getGroupTree(loginInfo.userId);
                this.props.getProject(selectNodeKey.substr(0,selectNodeKey.length-2),loginInfo.userId);
            }
        }

        const {forkResult,getProjectInfo} = nextProps;
        if (forkResult.forkProject&&this.props.forkResult.forkProject != forkResult.forkProject){
            PubSub.publish("evtRefreshGroupTree",{});
            this.setState({
                showForkPath: false,
                namespace:''
            });
            message.success('Fork成功!',3);
        }
        // else if(forkResult.errors && this.props.forkResult.errors != forkResult.errors){
        //     // message.error('Fork失败!'+forkResult.errors,3);
        //     this.errorMessage('Fork失败!',forkResult.errors);
        // }

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
        const {actions,loginInfo} = this.props;
        actions.getNamespace(loginInfo.userId);
        this.setState({
            showForkPath: true,
            namespace:''
        });
    }

    valueChange(value){
        this.setState({namespace:value});
    }

    handleOk(){
        const {actions,getProjectInfo,loginInfo} = this.props;
        if(this.state.namespace){
            actions.forkProject(getProjectInfo.id,loginInfo.username,this.state.namespace);
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

    concernedChange(is_conserned){
        const {loginInfo,starActions,getProjectInfo} = this.props;
        var starInfo={
            username:null,
            projectId:null,
        };
        starInfo.username = loginInfo.username;
        starInfo.projectId = getProjectInfo.id;
        if(is_conserned == '关注'){
            starActions.consernProject(starInfo);
        }else{
            starActions.unconsernProject(starInfo);
        }
    }

    memberCountClick(record){
        //调member接口
        const { getProjectInfo } = this.props;
        this.props.getProjectMembers(getProjectInfo.id);
        this.setState({
            showProjectMember:true,
        })
    }

    getDataSource(){
        const {getProjectInfo} = this.props;
        let dataSource = [];
        if(getProjectInfo ){
            dataSource = [{
                project_name:getProjectInfo.name,
                description:getProjectInfo.description,
                memberNum:"共"+getProjectInfo.member_count+"人",
                current_milestom:getProjectInfo.current_mileston_date,
                consern:getProjectInfo.star_state,
                //state:
                //tech_debt:
                //test_cover:
            }];
        }
        return dataSource;
    }

    render() {
        const {treeData,visible,getProjectInfo,forkResult} = this.props;

        if(visible == true && treeData.length!=0){
            const columns = (self)=>[
                {title: "项目名称", dataIndex: "project_name", key: "project_name"},
                {title: "项目描述", dataIndex: "description", key: "description"},
                {title: "项目成员人数", dataIndex: "memberNum", key: "memberNum",
                    render(text,record){
                        return <a onClick={self.memberCountClick.bind(self,record)}>{text}</a>
                    }
                },
                {title: "当前里程碑结束时间", dataIndex: "next_milestom", key: "next_milestom"},
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
            const dataSource = this.getDataSource();
            const forkFrom =getProjectInfo&&getProjectInfo.forks_from?<strong> Forked from {this.props.getProjectInfo.forks_from}</strong>:'';

            const forkPath =forkResult&&forkResult.namespace?forkResult.namespace.map(data => <Option key={data.path}>{data.path}</Option>):[];

            return (
                <div>
                    <Row>
                        <div className={styles.project_list_div}>
                            <Tooltip placement="top" title={forkFrom}>
                                <Button type="ghost" onClick={this.fork.bind(this)} >Fork</Button>
                            </Tooltip>
                            <span className={styles.arrow}></span>
                            <a className={styles.count} onClick={this.getForks.bind(this)}>{getProjectInfo?getProjectInfo.forks_count:''}</a>
                            <Select id="role"  defaultValue="ssh" style={{ width: 60 }} onSelect={this.handleChange.bind(this)}>
                                <Option value="ssh">SSH</Option>
                            </Select>
                            <Input style={{ width: 300 }}  value={this.state.url} type="text" readOnly/>
                            <TableView columns={columns(this)}
                                       dataSource={dataSource}
                                       loading={this.props.projectLoading}
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
        getProjectInfo:state.getProjectInfo.projectInfo,
        forkResult:state.forkProject,
        consernedInfo:state.consernProject.consernedInfo,
        unconsernInfo:state.consernProject.unconsernInfo,
        projectLoading:state.getProjectInfo.loading,
        selectNodeKey: state.getGroupInfo.selectedNode,
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
