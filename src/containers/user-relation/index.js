/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, message} from 'antd';
import TreeFilter from '../../components/tree-filter';
import {getUserRelationTree} from './actions/user-relation-tree-action';
import {getSelectNode} from './actions/select-node-action';
import PopoverImg from '../../components/popover-img';

class UserRelation extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const {userTreeData, selectedNode} = this.props;
        let add_member="",projectId=""
        if(this.props.location.state){
            add_member = this.props.location.state.addMember;
            projectId = this.props.location.state.projectId;
        }
        if(userTreeData.length == 0){
            this.props.getUserRelationTree();
        }
        if(selectedNode){
            this.context.router.push({
                pathname: '/userRelation/userInfo',
                state:{addMember:add_member,projectId:projectId,node:selectedNode}
            });
        }
    }

    onSelectNode(node){
        this.props.getSelectNode(node.id);
        let add_member="",projectId=""
        if(this.props.location.state){
            add_member = this.props.location.state.addMember;
            projectId = this.props.location.state.projectId;
        }
        this.context.router.push({
            pathname: '/userRelation/userInfo',
            state:{addMember:add_member,projectId:projectId,node:node}
        });
    }

    deleteUserGroup(){

    }

    editUserGroup(type,selectedRow){
        if(!type && !selectedRow){
            message.error('请选择要修改的组织!',3);
        }else{
            this.context.router.push({
                pathname: '/group-detail',
                state: {editType: type, selectedRow}
            });
        }
    }

    userGroupRelation(){

    }

    render(){
        const {userTreeData, loading, selectedNode} = this.props;
        const content = (
            <div>
                <a style={{paddingLeft:10}}
                   onClick={this.editUserGroup.bind(this, 'add', null)}>新建组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.editUserGroup.bind(this, null)}>修改组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.deleteUserGroup.bind(this)}>删除组织</a>
                <a style={{paddingLeft:10}}
                   onClick={this.userGroupRelation.bind(this)}>人员组织关系</a>
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
                        nodesData={userTreeData}
                        defaultSelectedKeys={[selectedNode]}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    <Row>
                        <PopoverImg content={content}/>
                    </Row>
                    <Row>
                        {this.props.children}
                    </Row>
                </Col>
            </Row>
        )
    }
}

UserRelation.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loading : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
        selectedNode: state.getSelectNode.selectedNode,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserRelationTree:bindActionCreators(getUserRelationTree, dispatch),
        getSelectNode:bindActionCreators(getSelectNode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRelation);