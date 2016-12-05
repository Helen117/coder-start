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
import { Row, notification, Modal, message, Form } from 'antd';
import {getGroupTree, setSelectNode} from '../project-mgr/actions/group-tree-action';
import {setGroupDelete} from '../project-mgr/actions/create-group-action';
import 'pubsub-js';
import PopoverImg from '../../components/popover-img';
import ProjectList from './project-list';
import ProjectItem from './project-item';

class ProjectMgrSub extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalVisible:false,
        };
    }

    editGroup(type, groupInfo) {
        if(!type && !groupInfo){
            message.error('请选择要修改的项目组!',3);
        }else{
            this.context.router.push({
                pathname: '/group-detail',
                state: {editType: type, groupInfo}
            });
        }
    }
    editProject(type, groupInfo) {
        if(groupInfo){
            this.context.router.push({
                pathname: '/project-detail',
                state: {editType: type, groupInfo,}
            });
        }else{
            message.error('请选择项目所在组!',3);
        }
    }
    deleteGroup(groupInfo){
        if(groupInfo && !this.isEmptyObject(groupInfo)){
            if(groupInfo.children.length == 0){
                this.setState({
                    modalVisible: true,
                });
            }else{
                message.error('项目组不为空，不能删除!',3);
            }
        }else{
            message.error('请选择需要删除的项目组！',3);
        }
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

    insertCallback(type){
        const {loginInfo} = this.props;
        notification.success({
            message: type,
            description: '',
            duration: 2
        });
        this.props.getGroupTree(loginInfo.userId)
    }

    handleOk(groupInfo) {
        const {setGroupDelete, loginInfo} = this.props;
        //调删除项目组的接口
        setGroupDelete(loginInfo.username, groupInfo.id)
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
    }

    componentWillReceiveProps(nextProps) {
        const {deleteResult} = nextProps;
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                modalVisible: false,
            });
            this.insertCallback('删除成功!');
        }
    }

    render(){
        const {currentTwoInfo, groupInfo,deleteLoading,node} = this.props;
        const content = (
            <div>
                <a style={{paddingLeft:10}}
                   onClick={this.deleteGroup.bind(this,groupInfo)}>删除项目组</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editGroup.bind(this, null, groupInfo)}>修改项目组</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editGroup.bind(this, 'add', null)}>新建项目组</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editProject.bind(this, 'add', groupInfo)}>新建项目</a>
            </div>
        );
        let showProjectList=false,showProjectItem=false;
        if(node){
            if((node.id.indexOf("_") < 0 && node.id > 0) || (node.id.indexOf("_g") > 0)){
                showProjectList=true;
                showProjectItem=false;
            }else if(node.id.indexOf("_") >= 0 && node.id.indexOf("_g") < 0){
                showProjectList=false;
                showProjectItem=true;
            }else {
                showProjectList=false;
                showProjectItem=false;
            }
        }

        return (
            <div>
                {(!this.isEmptyObject(currentTwoInfo) && currentTwoInfo.link == '/project-mgr/project-mgr-sub')?(
                    <Row>
                        <PopoverImg content={content}/>
                        <Modal title="确认删除此项目组吗?"
                               visible={this.state.modalVisible}
                               onOk={this.handleOk.bind(this,groupInfo)}
                               confirmLoading={deleteLoading?true:false}
                               onCancel={this.handleCancel.bind(this)}
                        >
                            <p>{groupInfo?groupInfo.name:''}</p>
                        </Modal>
                    </Row>
                ):(<Row></Row>)}
                <Row>
                    {showProjectList==true?(<ProjectList visible={showProjectList}
                                                         node={node}/>):(<div></div>)}
                    {showProjectItem==true?(<ProjectItem visible={showProjectItem}
                                                   node={node}/>
                    ):(<div></div>)}
                </Row>
            </div>
        );
    }
}

ProjectMgrSub.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectMgrSub = Form.create()(ProjectMgrSub);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        list: state.getGroupTree.treeData,
        node:state.getGroupInfo.node,
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
        groupInfo:state.getGroupInfo.groupInfo,
        deleteResult: state.createGroup.deleteResult,
        deleteLoading:state.createGroup.deleteLoading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGroupTree: bindActionCreators(getGroupTree, dispatch),
        setGroupDelete:bindActionCreators(setGroupDelete, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMgrSub);
