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
import {Switch,Icon, Row, Button, Modal, notification, Input, Form} from 'antd';
import 'pubsub-js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TableView from '../../components/table';
import styles from './index.css';
import { searchGroupByGroupId, findProjectIdByProjectName } from './util';
import {setProjectDelete} from '../project-mgr/actions/create-project-action';
import {getGroupTree} from '../project-mgr/actions/group-tree-action';

const confirm = Modal.confirm;
const FormItem = Form.Item;

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.showProjectList = this.showProjectList.bind(this);
        this.state = {
            listType:false,
            nullType:false,
            listNode:null,
            modalVisible:false
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

    insertCallback(message){
        const {loginInfo} = this.props;
        notification.success({
            message: message,
            description: '',
            duration: 1
        });
        this.props.getGroupTree(loginInfo.userId);
    }

    errCallback(message,errMessage){
        notification.error({
            message: message,
            description:errMessage,
            duration: 4
        });
    }

    componentWillReceiveProps(nextProps) {
        const { deleteResult, deleteErrors } = nextProps;
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                modalVisible: false,
            });
            this.insertCallback('删除成功!');
        }else if(this.props.deleteErrors != deleteErrors && deleteErrors){
            this.errCallback('删除失败!',deleteErrors);
        }

        const {node} = nextProps.location.state;
        if(node){
            this.showProjectList(node);
        }
    }

    editProject(type, selectedRow){
        this.context.router.push({
            pathname: '/project-detail',
            state: {editType: type, selectedRow}
        });
    }

    handleOk() {
        const {loginInfo,setProjectDelete, treeData} = this.props;
        const { form } = this.props;
        const formData = form.getFieldsValue();
        let projectId = findProjectIdByProjectName(this.state.selectProjectName, treeData);
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
            const {treeData,getGroupInfo, deleteLoading} = this.props;
            const {getFieldProps} = this.props.form;
            /*const deleteResultProps = getFieldProps('delete_result',
                {});*/
            if(getGroupInfo && treeData.length>0){
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
                            <Modal title="确认删除此项目吗?"
                                   visible={this.state.modalVisible}
                                   onOk={this.handleOk.bind(this)}
                                   confirmLoading={deleteLoading?true:false}
                                   onCancel={this.handleCancel.bind(this)}
                            >
                                {/*<p>如果确认此操作，请在下框输入原因：</p>
                                <FormItem>
                                    <Input type="textarea" {...deleteResultProps} rows={4} />
                                </FormItem>*/}
                            </Modal>
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

ProjectList = Form.create()(ProjectList);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        groupMembers:state.getGroupMembers.groupMembers,
        fetchGroupMembers:state.getGroupMembers.fetchStatus,
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



