/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Icon, Modal, message, Popover, Input } from 'antd';
import TreeFilter from '../../components/tree-filter';
import {getGroupTree, setSelectNode} from './actions/group-tree-action';
import {getGroupMembers} from './actions/group_members_action';
import {getGroupInfo,getProjectInfo} from './actions/select-treenode-action';
import {getProjectMembers} from './actions/project-members-action';
import {setGroupDelete} from './actions/create-group-action';
import 'pubsub-js';
import * as Cookies from "js-cookie";
import styles from './index.css';

export GroupDetail from './group-detail';
export ProjectDetail from './project-detail';

const confirm = Modal.confirm;

class ProjectMgr extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectGroupName:null,
            selectGroupId:null,
            showSettingDiv:true,
            modalVisible:false
        };
    }

    componentDidMount() {
        const {loginInfo} =this.props;
        PubSub.subscribe("evtRefreshGroupTree",()=>this.props.getGroupTree(loginInfo.userId));
        const {treeData} = this.props;
        if (treeData.length == 0){
            this.props.getGroupTree(loginInfo.userId);
        }
    }

    editGroup(type, selectedRow) {
        if(!type && !selectedRow){
            message.error('请选择要修改的项目组!',3);
        }else{
            this.context.router.push({
                pathname: '/group-detail',
                state: {editType: type, selectedRow}
            });
        }
    }
    editProject(type, selectedRow) {
        this.context.router.push({
            pathname: '/project-detail',
            state: {editType: type, selectedRow,}
        });
    }

    searchGroupByGroupId(groupId,list){
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

    searchGroupByProjectId(projectId,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                var project_cat = list[i].children[j];
                for(var k=0; k<project_cat.children.length; k++){
                    if(projectId == project_cat.children[k].id){
                        if(project_cat.id > 0){
                            groupInfo = project_cat;
                        }else{
                            groupInfo = {};
                        }
                        projectInfo = project_cat.children[k];
                        return {projectInfo,groupInfo}
                    }
                }
            }
        }
    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    onSelectNode(node){
        const {loginInfo, list, currentOneInfo, currentTwoInfo} = this.props;
        if((node.id.indexOf("_") < 0 && node.id > 0) || (node.id.indexOf("_g") > 0)){//点击项目组节点
            if(node.id.indexOf("_g") < 0){
                this.props.getGroupMembers(node.id);
            }
            const groupInfo = this.searchGroupByGroupId(node.id, list);
            this.props.getGroupInfo(groupInfo, node.id);
        }else if(node.id.indexOf("_") >= 0 && node.id.indexOf("_g") < 0){//点击项目节点
            var node_temp = node.id;
            const {projectInfo, groupInfo} = this.searchGroupByProjectId(node.id, list);
            this.props.getProjectInfo(node_temp.substr(0,node_temp.length-2));
            this.props.getGroupInfo(groupInfo, node.id);
            this.props.getProjectMembers(node_temp.substr(0,node_temp.length-2));
        }
        if(currentOneInfo){//根据菜单链接控制路由
            if(!this.isEmptyObject(currentTwoInfo)){
                if(currentTwoInfo.link == '/project-mgr'){
                    if((node.id.indexOf("_") < 0 && node.id > 0) || (node.id.indexOf("_g") > 0)){
                        this.context.router.push({
                            pathname: '/project-mgr/project-list',
                            state: {node}
                        });
                    }else if(node.id.indexOf("_") >= 0 && node.id.indexOf("_g") < 0){
                        this.context.router.push({
                            pathname: '/project-mgr/project-item',
                            state: {node}
                        });
                    }
                }else{
                    if(node.id.indexOf("_") >= 0 && node.id.indexOf("_g") < 0){
                        this.context.router.push({
                            pathname: currentTwoInfo.link,
                        });
                    }
                }
            }else{
                this.context.router.push({
                    pathname: currentOneInfo.link,
                });
            }
        }
        //this.props.setSelectNode(node.id);

    }

    clickSettingImg(){
        this.setState({
            showSettingDiv:!this.state.showSettingDiv
        })
    }

    insertCallback(type){
        const {loginInfo} = this.props;
        notification.success({
            message: type,
            description: '',
            duration: 2
        });
        this.props.getGroupTree(loginInfo.userId)
    }

    errCallback(type,errmessage){
        notification.error({
            message: type,
            description:errmessage,
            duration: 4
        });
    }

    /*handleOk() {
        this.setState({
            ModalText: 'The modal dialog will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                modalVisible: false,
                confirmLoading: false,
            });
        }, 2000);
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
    }*/

    deleteGroup(groupInfo){
        const {setGroupDelete, loginInfo} = this.props;
        if(groupInfo.children.length == 0){//项目组为空
            if(groupInfo){
                /*this.setState({
                    modalVisible: true,
                });*/
                confirm({
                    title: '您是否确定要删除此项目组？',
                    content:groupInfo.name,
                    onOk() {
                        //调删除项目组的接口
                        setGroupDelete(loginInfo.username, groupInfo.id)
                    },
                    onCancel() {
                    }
                })
            }else{
                message.error('请选择需要删除的项目组！',3);
            }
        }else{
            message.error('项目组不为空，不能删除!',3);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {deleteResult, deleteErrors} = nextProps;
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult){
            this.insertCallback('删除成功!');
        }else if(this.props.deleteErrors != deleteErrors && deleteErrors){
            this.errCallback('删除失败!',deleteErrors);
        }
    }

    render(){
        const {treeData, loading, currentTwoInfo, selectNodeKey, groupInfo} = this.props;
        const content = (
            <div>
                <a className={styles.setting_operate_content}
                   onClick={this.deleteGroup.bind(this,groupInfo)}>删除项目组</a>
                <a className={styles.setting_operate_content}
                   onClick={this.editGroup.bind(this, null, groupInfo)}>修改项目组</a>
                <a className={styles.setting_operate_content}
                   onClick={this.editProject.bind(this, 'add', null)}>新建项目</a>
                <a className={styles.setting_operate_content}
                   onClick={this.editGroup.bind(this, 'add', null)}>新建项目组</a>
            </div>
        );
        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loading}
                        notFoundMsg='找不到项目'
                        inputPlaceholder="快速查询项目"
                        loadingMsg="正在加载项目信息..."
                        nodesData={treeData}
                        defaultSelectedKeys={[selectNodeKey]}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    {(!this.isEmptyObject(currentTwoInfo) && currentTwoInfo.link == '/project-mgr')?(
                        <Row>
                            <Popover
                                content={content}
                                trigger="click"
                                placement="left"
                                visible={this.state.showSettingDiv}
                                overlayStyle={this.state.showSettingDiv?{"zIndex":0}:{}}
                            >
                                <div className={styles.set_div} onClick={this.clickSettingImg.bind(this)}>
                                    <Icon type="setting" className={styles.setting_img} />
                                    <Icon type="down" className={styles.down_img}/>
                                </div>
                            </Popover>
                            {/*<Modal title="确认删除此项目组吗?"
                                   visible={this.state.modalVisible}
                                   onOk={this.handleOk.bind(this)}
                                   confirmLoading={this.state.confirmLoading}
                                   onCancel={this.handleCancel.bind(this)}
                            >
                                <p>如果确认要删除，请输入要删除的原因：</p>
                                <Input type="textarea" rows={4} />
                            </Modal>*/}
                        </Row>
                    ):(<Row></Row>)}
                    <Row>
                        {this.props.children}
                    </Row>
                </Col>
            </Row>
        );
    }

}

ProjectMgr.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loading : state.getGroupTree.loading,
        treeData: state.getGroupTree.treeData,
        loginInfo:state.login.profile,
        list: state.getGroupTree.treeData,
        selectNodeKey: state.getGroupInfo.selectedNode,
        currentOneInfo:state.getMenuBarInfo.currentOne,
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
        groupInfo:state.getGroupInfo.groupInfo,
        deleteResult: state.createGroup.deleteResult,
        deleteErrors:state.createGroup.errors,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        //setSelectNode: bindActionCreators(setSelectNode, dispatch),
        getGroupMembers:bindActionCreators(getGroupMembers, dispatch),
        getGroupInfo:bindActionCreators(getGroupInfo, dispatch),
        getProjectInfo:bindActionCreators(getProjectInfo, dispatch),
        getProjectMembers:bindActionCreators(getProjectMembers, dispatch),
        setGroupDelete:bindActionCreators(setGroupDelete, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMgr);
