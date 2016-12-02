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
import {Icon, Row,Col, Button, Modal, notification, Form} from 'antd';
import 'pubsub-js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import styles from './index.css';
import { searchGroupByGroupId, findProjectIdByProjectName } from './util';
import {setProjectDelete} from '../project-mgr/actions/create-project-action';
import {getGroupTree} from '../project-mgr/actions/group-tree-action';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false
        };
    }

    insertCallback(message){
        const {loginInfo} = this.props;
        notification.success({
            message: message,
            description: '',
            duration: 1
        });
        this.props.getGroupTree(loginInfo.userId);
    }

    componentWillReceiveProps(nextProps) {
        const { deleteResult } = nextProps;
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                modalVisible: false,
            });
            this.insertCallback('删除成功!');
        }
    }

    editProject(type, selectedRow){
        this.context.router.push({
            pathname: '/project-detail',
            state: {editType: type, selectedRow}
        });
    }

    handleOk() {
        const {loginInfo,setProjectDelete,getGroupInfo} = this.props;
        let projectId = findProjectIdByProjectName(this.state.selectProjectName, getGroupInfo);
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
        this.setState({
            modalVisible: true,
            selectProjectName:selectedRow.projectName
        });
    }

    getDataSource(groupInfo){
        let dataSource = [];
        for(var i=0;i<groupInfo.children.length;i++){
            dataSource.push({
                key:i+1,
                projectName:groupInfo.children[i].name,
                owner:groupInfo.children[i].owner,
            });
        }
        return dataSource;
    }

    render() {
        const {node,visible} = this.props;
        let listType = false,nullType = false;
        if(visible == true){
            if(node.isLeaf==false && ((node.id.indexOf("_")<0 && node.id>0) || (node.id.indexOf("_g")>0))){
                //项目组节点下有项目
                listType = true;nullType = false;
            }else if(node.isLeaf==true && ((node.id.indexOf("_")<0 && node.id>0) || (node.id.indexOf("_g")>0))){
                //项目组节点下没有项目
                listType = false;nullType = true;
            }
        }

        if(listType == true){//展示项目组信息
            const {treeData,getGroupInfo, deleteLoading} = this.props;
            if(treeData.length>0){
                const dataSource = getGroupInfo?this.getDataSource(getGroupInfo):[];
                const groupDesc = getGroupInfo?(
                    <Row>
                        <Col span={4}>项目组名称:{getGroupInfo.name}</Col>
                        <Col span={4}>项目组创建人：{getGroupInfo.owner}</Col>
                        <Col span={16}>项目组创建目的:{getGroupInfo.description}</Col>
                    </Row>
                ):(<div></div>);
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
                                   confirmLoading={deleteLoading?true:false}
                                   onCancel={this.handleCancel.bind(this)}
                            >   </Modal>
                        </Row>
                    </div>
                )
            }else{return null}
        } else if(nullType == true){
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
        getGroupInfo:state.getGroupInfo.groupInfo,
        deleteResult:state.createProject.deleteResult,
        deleteErrors:state.createProject.deleteErrors,
        deleteLoading:state.createProject.deleteLoading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setProjectDelete:bindActionCreators(setProjectDelete, dispatch),
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);



