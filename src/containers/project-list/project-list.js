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
import {Switch,Icon, Row, Col, Button, Modal} from 'antd';
import 'pubsub-js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as starActions from './actions/consern-project-actions';
import {getProjectStar} from '../project-mgr/actions/project-star-action';
import TableView from '../../components/table';
import styles from './index.css';

const confirm = Modal.confirm;

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
        if(data.isLeaf==false && ((data.id.indexOf("_")<0 && data.id>0) || (data.id.indexOf("_g")>0))){
            this.setState({
                listType:true,
                listNode:data.id,
            });
        }else if(data.isLeaf==true && ((data.id.indexOf("_")<0 && data.id>0) || (data.id.indexOf("_g")>0))){
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
            for(var j=0;j<list[i].children.length;j++){
                if(groupId == list[i].children[j].id){
                    groupInfo = list[i].children[j];
                    return groupInfo;
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {node} = nextProps.location.state;
        if(node){
            this.showProjectList(node);
        }
    }

    editProject(type, selectedRow){
        this.context.router.push({
            pathname: '/project-mgr/project-detail',
            state: {editType: type, selectedRow}
        });
    }

    deleteProject(type, selectedRow){
        confirm({
            title: '您是否确定要删除此项目？',
            content:selectedRow.projectName,
            onOk() {
                //调删除项目的接口
            },
            onCancel() {
            }
        })
    }

    render() {
        if(this.state.listType == true){//展示项目组信息
            const {list,getGroupInfo,groupMembers,fetchGroupMembers} = this.props;
            if(getGroupInfo){
                var groupId = this.state.listNode;
                var groupInfo = this.searchGroupByGroupName(groupId,list);

                const dataSource = [];
                for(var i=0;i<groupInfo.children.length;i++){
                    var manager = "";
                    if(fetchGroupMembers || false){
                        if(groupInfo.id.indexOf("_g")<0){
                            for(var j=0;j<groupMembers.length;j++){
                                if(groupInfo.children[i].creatorId == groupMembers[j].id){
                                    manager = groupMembers[j].name;
                                }
                            }
                        }else{
                            manager = "";
                        }
                    }
                    dataSource.push({
                        key:i+1,
                        projectName:groupInfo.children[i].name,
                        manager:manager,
                        owner:groupInfo.children[i].owner,
                    });
                }
                const groupColumns = (self)=>[
                    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
                    {title: "当前项目经理", dataIndex: "manager", key: "manager"},
                    {title: "owner", dataIndex: "owner", key: "owner"},
                    {title:"操作",dataIndex:"operate",key:"operate",
                        render(text,record){
                            return (
                                <div>
                                    <Button type="ghost" onClick={self.editProject.bind(self, 'modify', record)}>修改</Button>
                                    <Button type="ghost" onClick={self.deleteProject.bind(self, 'delete', record)}>删除</Button>
                                </div>
                            )
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
                    </div>
                )
            }else{return null}
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
        list: state.getGroupTree.treeData,
        getGroupInfo:state.getGroupInfo.groupInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);

