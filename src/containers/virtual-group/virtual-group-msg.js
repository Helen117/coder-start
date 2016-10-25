/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Tree, Input, Icon, Transfer } from 'antd';
import TreeFilter from '../../components/tree-filter';
import 'pubsub-js';

class virtualGroupMsg extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectGroupName:null,
            selectGroupId:null
        };
    }

    componentDidMount() {
        const {loginInfo} =this.props;
        PubSub.subscribe("evtRefreshGroupTree",()=>this.props.getGroupTree(loginInfo.username));
        const {treeData} = this.props;
        if (treeData && treeData.length == 0){
            this.props.getGroupTree(loginInfo.username);
        }
    }

    createVirtualGroup(){
        this.context.router.push({
            pathname: '/createVirtualGroup',
        });
    }

    searchGroupByGroupId(groupId,list){
        var groupInfo;
        for(var i=0;i<list.length;i++){
            if(groupId == list[i].id){
                groupInfo = list[i];
                return groupInfo;
            }
        }
    }

    searchGroupByProjectId(projectId,list){
        var projectInfo,groupInfo;
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].children.length;j++){
                if(projectId == list[i].children[j].gitlabProject.id){
                    groupInfo = list[i];
                    projectInfo = list[i].children[j];
                    return {projectInfo,groupInfo}
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
        const {currentOneInfo, currentTwoInfo} = this.props;

        if(currentOneInfo){//根据菜单链接控制路由
            if(!this.isEmptyObject(currentTwoInfo)){
                if(currentTwoInfo.link == '/project-mgr'){
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
        const {treeData, loading, currentTwoInfo, selectNodeKey} = this.props;
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
                    {(!this.isEmptyObject(currentTwoInfo) && currentTwoInfo.link == '/virtual-group-mr')?(
                        <Row>
                            <div style={{margin:15}}>
                                    <Button className="pull-right" type="primary"  onClick={this.createVirtualGroup.bind(this,'add',null)}>创建虚拟组</Button>
                            </div>
                        </Row>
                    ):(<div></div>)}
                    <Row>
                        {this.props.children}
                    </Row>
                </Col>
            </Row>
        );
    }

}

virtualGroupMsg.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(virtualGroupMsg);