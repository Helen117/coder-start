/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col } from 'antd';
import TreeFilter from '../../components/tree-filter';
import {putSelectedTreeItemToState,fetchProjectSetTree} from './project-set-action';
import 'pubsub-js';

class ProjectSetTree extends React.Component{
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


    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    onSelectNode(node){
        const {currentOneInfo, currentTwoInfo} = this.props;
        node.selectedItemId=node.id.substring(0,node.id.length-2);
        this.props.putSelectedTreeItemToStateAction(node);
        if(currentOneInfo){//根据菜单链接控制路由
            if(!this.isEmptyObject(currentTwoInfo)){
                this.context.router.push({
                    pathname: currentTwoInfo.link,
                });
            }else{
                this.context.router.push({
                    pathname: currentOneInfo.link,
                });
            }
        }
    }


    render(){
        const {projectSet, loading,errMessage} = this.props;

        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loading}
                        notFoundMsg={errMessage}
                        inputPlaceholder="快速查询项目"
                        loadingMsg="正在加载项目集合信息..."
                        nodesData={projectSet}
                        busiType="project-set-tree"
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    <Row>
                        {this.props.children}
                    </Row>
                </Col>
            </Row>
        );
    }

}

ProjectSetTree.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        currentOneInfo:state.getMenuBarInfo.currentOne,
        currentTwoInfo: state.getMenuBarInfo.currentTwo,
        projectSet: state.projectSet.projectSetTree,
        errMessage: state.projectSet.errMessage,
        loading: state.projectSet.getProjectSetTreeLoading,
        selectedProjectSet: state.projectSet.selectedProjectSet,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        putSelectedTreeItemToStateAction: bindActionCreators(putSelectedTreeItemToState, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetTree);