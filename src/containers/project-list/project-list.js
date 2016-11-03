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
import {Switch,Icon, Row, Button, Modal} from 'antd';
import 'pubsub-js';
import {connect} from 'react-redux';
import TableView from '../../components/table';
import styles from './index.css';
import { searchGroupByGroupId } from './util';

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
        const {node} = this.props.location.state;
        if(node){
            this.showProjectList(node);
        }
    }

    showProjectList(data){
        if(data.isLeaf==false && ((data.id.indexOf("_")<0 && data.id>0) || (data.id.indexOf("_g")>0))){
            this.setState({//项目组节点下有项目
                listType:true,
                listNode:data.id,
            });
        }else if(data.isLeaf==true && ((data.id.indexOf("_")<0 && data.id>0) || (data.id.indexOf("_g")>0))){
            this.setState({//项目组节点下没有项目
                listType:false,
                nullType:true,
            });
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

    getDataSource(groupInfo){
        const {fetchGroupMembers, groupMembers} = this.props;
        let dataSource = [];
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
        return dataSource;
    }

    render() {
        if(this.state.listType == true){//展示项目组信息
            const {treeData,getGroupInfo} = this.props;
            if(getGroupInfo){
                var groupId = this.state.listNode;
                var groupInfo = searchGroupByGroupId(groupId,treeData);
                const dataSource = this.getDataSource(groupInfo);
                return (
                    <div>
                        <Row>
                            <div className ={styles.project_list_div}>
                                <div>
                                    <p>项目组名称:{groupInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建人：{groupInfo.owner}&nbsp;&nbsp;&nbsp;&nbsp;项目组创建目的:{groupInfo.description}</p>
                                </div>
                                <TableView columns={this.groupColumns(this)}
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
        treeData: state.getGroupTree.treeData,
        getGroupInfo:state.getGroupInfo.groupInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);

ProjectList.prototype.groupColumns = (self)=>[
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

