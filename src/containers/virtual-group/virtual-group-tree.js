/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Tree, Input, Icon, Transfer } from 'antd';
import TreeFilter from '../../components/tree-filter';
import putVirtualGroupToState from './actions/put-virtual-group-into-state-action';
import fetchVirtualGroupTree from  './actions/fetch-virtual_group_tree_action';
import 'pubsub-js';

class virtualGroupTree extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectGroupName:null,
            selectGroupId:null
        };
    }

    componentDidMount() {
        const {loginInfo,virtualGroupTree} =this.props;
        if(!virtualGroupTree) {
            this.props.fetchVirtualGroupTree(loginInfo.username);
        }
    }

    createVirtualGroup(){
        this.context.router.push({
            pathname: '/createVirtualGroup',
        });
    }


    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    onSelectNode(node){

        const {currentOneInfo, currentTwoInfo} = this.props;
        this.props.putVirtualGroupToState(node);
        if(currentOneInfo){//根据菜单链接控制路由
            if(!this.isEmptyObject(currentTwoInfo)){
                this.context.router.push({
                    pathname: currentTwoInfo.link,
                });
            }
        }else{
                this.context.router.push({
                    pathname: currentOneInfo.link,
                });
        }
    }

    render(){
        const {virtualGroupTree, loading, currentTwoInfo} = this.props;
        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loading}
                        notFoundMsg='找不到项目'
                        inputPlaceholder="快速查询项目"
                        loadingMsg="正在加载项目信息..."
                        nodesData={virtualGroupTree}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    {(!this.isEmptyObject(currentTwoInfo) && currentTwoInfo.link == '/virtual-group-tree')?(
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

virtualGroupTree.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        currentOneInfo:state.getMenuBarInfo.currentOne,
        currentTwoInfo: state.getMenuBarInfo.currentTwo,
        virtualGroupTree: state.fetchVirtualGroupTree.virtualGroupTree,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchVirtualGroupTree: bindActionCreators(fetchVirtualGroupTree, dispatch),
        putVirtualGroupToState: bindActionCreators(putVirtualGroupToState, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(virtualGroupTree);