/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Tree, Input, Icon, Transfer,Modal,Spin } from 'antd';
import TreeFilter from '../../components/tree-filter';
import putProjectSetToState from './actions/put-project-set-into-state-action';
import fetchProjectSetTree from  './actions/fetch-project_set_tree_action';
import {deleteProjectSet} from './actions/project-set-create-action'
import 'pubsub-js';

const confirm = Modal.confirm;
class projectSetTree extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectGroupName:null,
            selectGroupId:null
        };
    }

    componentDidMount() {
        const {loginInfo,projectSet} =this.props;
        if(!projectSet) {
            this.props.fetchProjectSetTree(loginInfo.userId);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {  errMessage ,delErrorMsg,delResult} = nextProps;
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage,'项目集加载');
        }
        if(this.props.delErrorMsg != delErrorMsg && delErrorMsg){
            this.errCallback(delErrorMsg,'删除项目集')
        }else if(this.props.delResult != delResult && delResult){
            this.successCallback('删除');

        }

    }

    errCallback(errMessage,type){
        notification.error({
            message: type+'失败',
            description: errMessage,
            duration: 2
        });
    }

    editProjectSet(type){
        this.context.router.push({
            pathname: '/editProjectSet',
            state:{editType: type}
        });
    }

    delProjectSet(type,selectedProjectSet){
        const deleteProjectSetAction = this.props.deleteProjectSetAction;
        const userId = this.props.loginInfo.userId;
        const projectSet = this.props.projectSet;
        let i = 0;
        for(i=0; i< projectSet.length; i++){
            if(projectSet[i].id==selectedProjectSet.id && projectSet[i].children.length>0){
                this.delForbidden();
                break;
            }
        }
        if(i >= projectSet.length) {
            confirm({
                title: '您是否确定要删除此项目集合',
                content: '删除之后项目集合内容将会被丢弃',
                onOk() {
                    deleteProjectSetAction(selectedProjectSet.selectedItemId, userId);
                },
                onCancel() {
                }
            })
        }
    }

    delForbidden(errMessage){
        notification.error({
            message: '项目集非空，不允许删除',
            description: '请将项目集中的项目全部移除后，才能进行删除操作',
            duration: 2
        });
    }

    successCallback(type){
        const userId = this.props.loginInfo.userId;
        notification.success({
            message: type+'成功',
            description: '',
            duration: 1
        });
        this.props.fetchProjectSetTree(userId);
    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    onSelectNode(node){
        const {currentOneInfo, currentTwoInfo} = this.props;
        node.selectedItemId=node.id.substring(0,node.id.length-2);
        this.props.putProjectSetToState(node);
        if(currentOneInfo){//根据菜单链接控制路由
            if(!this.isEmptyObject(currentTwoInfo)){
                if(currentTwoInfo.link == '/projectSetTree'){
                    if(node.id){
                        this.context.router.push({
                            pathname: '/projectSetTree/projectInfo',
                        });
                    }
                }else{
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




    render(){
        const selectedProjectSet = this.props.selectedProjectSet;
        const {projectSet, loading, currentTwoInfo,errMessage} = this.props;
        const spinning = this.props.delLoading?true:false;
        return (
            <Spin spinning={spinning} tip="正在删除数据">
                <Row className="ant-layout-content" style={{minHeight:300}}>
                    <Col span={6}>
                        <TreeFilter
                            loading={loading}
                            notFoundMsg={errMessage}
                            inputPlaceholder="快速查询项目"
                            loadingMsg="正在加载项目信息..."
                            nodesData={projectSet}
                            onSelect={this.onSelectNode.bind(this)}/>
                    </Col>
                    <Col span={18}>
                        {(!this.isEmptyObject(currentTwoInfo) && currentTwoInfo.link == '/projectSetTree')?(
                            <Row>
                                <div style={{margin:15}}>
                                    <Button className="pull-right"
                                            type="primary"
                                            disabled = {loading || errMessage}
                                            onClick={this.editProjectSet.bind(this,'add')}>创建项目集</Button>
                                </div>
                                <div style={{margin:15}}>
                                    <Button className="pull-right"
                                            type="primary"
                                            disabled = {selectedProjectSet?selectedProjectSet.id.indexOf('_g')>0?false:true:true}
                                            onClick={this.editProjectSet.bind(this,'update')}>修改项目集</Button>
                                </div>
                                <div style={{margin:15}}>
                                    <Button className="pull-right"
                                            type="primary"
                                            disabled = {selectedProjectSet?selectedProjectSet.id.indexOf('_g')>0?false:true:true}
                                            onClick={this.delProjectSet.bind(this,'del',selectedProjectSet)}>删除项目集</Button>
                                </div>
                            </Row>
                        ):(<div></div>)}
                        <Row>
                            {this.props.children}
                        </Row>
                    </Col>
                </Row>
            </Spin>
        );
    }

}

projectSetTree.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        currentOneInfo:state.getMenuBarInfo.currentOne,
        currentTwoInfo: state.getMenuBarInfo.currentTwo,
        projectSet: state.fetchProjectSetTree.projectSetTree,
        errMessage: state.fetchProjectSetTree.errMessage,
        loading: state.fetchProjectSetTree.loading,
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
        delErrorMsg: state.deleteProjectSet.errorMsg,
        delResult: state.deleteProjectSet.result,
        delLoading: state.deleteProjectSet.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        putProjectSetToState: bindActionCreators(putProjectSetToState, dispatch),
        deleteProjectSetAction: bindActionCreators(deleteProjectSet, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(projectSetTree);