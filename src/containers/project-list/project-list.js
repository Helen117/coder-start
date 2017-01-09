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
import {Icon, Row,Col, Button, Modal, notification, Form,message} from 'antd';
import 'pubsub-js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import styles from './index.css';
import { searchGroupByGroupId, findProjectIdByProjectName } from './util';
import {setProjectDelete} from '../project-mgr/actions/create-project-action';
import {getGroupTree} from '../project-mgr/actions/group-tree-action';
import {getGroupInfo} from '../project-mgr/actions/create-group-action';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false
        };
    }

    insertCallback(messageInfo){
        const {loginInfo} = this.props;
        notification.success({
            message: messageInfo,
            description: '',
            duration: 1
        });
        this.props.getGroupTree(loginInfo.userId);
    }

    componentWillReceiveProps(nextProps) {
        const { project, treeData } = nextProps;
        const {projectGroup} = this.props;
        //删除返回信息
        if(this.props.project.deleteProject && project.deleteProject
        && this.props.project.deleteProject.result != project.deleteProject.result
            && project.deleteProject.result){
                this.setState({
                    modalVisible: false,
                });
                this.insertCallback('删除成功!');
        }
        //删除项目更新项目组信息
        const node = projectGroup.getGroupInfo?projectGroup.getGroupInfo.node:'';
        if (this.props.treeData != treeData && treeData.length>0
        && projectGroup.getGroupInfo){
            const resetGroupInfo = searchGroupByGroupId(projectGroup.getGroupInfo.groupInfo.id,treeData);
            if(resetGroupInfo){
                this.props.setGroupInfo(resetGroupInfo, node.id,node);
            }
        }
    }

    editProject(type, selectedRow){
        const {loginInfo} = this.props;
        if(selectedRow.owner != loginInfo.name){
            message.error('你不能修改别人的项目!',3);
        }else{
            this.context.router.push({
                pathname: '/project-detail',
                state: {editType: type, selectedRow}
            });
        }
    }

    handleOk() {
        const {loginInfo,setProjectDelete,projectGroup} = this.props;
        const groupInfo = projectGroup.getGroupInfo?projectGroup.getGroupInfo.groupInfo:{};
        let projectId = findProjectIdByProjectName(this.state.selectProjectName, groupInfo);
        projectId = projectId.substr(0,projectId.length-2);
        //调删除项目的接口
        setProjectDelete(loginInfo.username,projectId);
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
    }

    deleteProject(type, selectedRow){
        const {loginInfo} = this.props;
        if(selectedRow.owner != loginInfo.name){
            message.error('你不能删除别人的项目!',3);
        }else{
            this.setState({
                modalVisible: true,
                selectProjectName:selectedRow.projectName
            });
        }
    }

    getDataSource(groupInfo){
        const dataSource = [];
        for(var i=0;i<groupInfo.children.length;i++){
            dataSource.push({
                key:i+1,
                projectName:groupInfo.children[i].name,
                owner:groupInfo.children[i].owner,
            });
        }
        return dataSource;
    }

    isEmptyObject(obj){
        for(var key in obj){
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    render() {
        const {visible,projectGroup,treeData, project} = this.props;
        let listType = false;
        const node = projectGroup.getGroupInfo?projectGroup.getGroupInfo.node:'';
        if(visible){
            if(!node.isLeaf && ((node.id.indexOf("_")<0 && node.id>0) || (node.id.indexOf("_g")>0))){
                //项目组节点下有项目
                listType = true;
            }else if(node.isLeaf && ((node.id.indexOf("_")<0 && node.id>0) || (node.id.indexOf("_g")>0))){
                //项目组节点下没有项目
                listType = true;
            }
        }
        const groupInfo = projectGroup.getGroupInfo?projectGroup.getGroupInfo.groupInfo:{};
        let dataSource = [],groupDesc = (<div></div>);
        if(treeData.length>0){
            dataSource = !this.isEmptyObject(groupInfo)?this.getDataSource(groupInfo):[];
            groupDesc = !this.isEmptyObject(groupInfo)?(
                <div>
                    <span>项目组名称：{groupInfo.name}</span>
                    <span style={{paddingLeft:20}}>项目组创建人：{groupInfo.owner}</span>
                    <span style={{paddingLeft:20}}>项目组创建目的：{groupInfo.description}</span>
                </div>
            ):(<div></div>);
        }
        const deleteLoading = project.deleteProject?project.deleteProject.loading:false;

        if(listType){//展示项目组信息
            return (
                <div>
                    <Row>
                        <div className ={styles.project_list_div}>
                            {groupDesc}
                            <TableView columns={this.groupColumns(this)}
                                       dataSource={dataSource}
                            ></TableView>
                        </div>
                        <Modal title="确认删除此项目吗?"
                               visible={this.state.modalVisible}
                               onOk={this.handleOk.bind(this)}
                               confirmLoading={deleteLoading}
                               onCancel={this.handleCancel.bind(this)}
                        >   </Modal>
                    </Row>
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

ProjectList.prototype.groupColumns = (self)=>[
    {title: "项目名称", dataIndex: "projectName", key: "projectName"},
    {title: "项目创建人", dataIndex: "owner", key: "owner"},
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

ProjectList = Form.create()(ProjectList);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        treeData: state.getGroupTree.treeData,
        projectGroup:state.projectGroup,
        project:state.project,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setProjectDelete:bindActionCreators(setProjectDelete, dispatch),
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        setGroupInfo:bindActionCreators(getGroupInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);



