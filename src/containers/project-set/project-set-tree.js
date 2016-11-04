/**
 * Created by zhaojp on 2016/10/24.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Tree, Input, Icon, Transfer } from 'antd';
import TreeFilter from '../../components/tree-filter';
import putProjectSetToState from './actions/put-project-set-into-state-action';
import fetchProjectSetTree from  './actions/fetch-project_set_tree_action';
import 'pubsub-js';

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
        const {  errMessage } = nextProps;
        if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }

    }

    errCallback(errMessage){
        notification.error({
            message: '虚拟组加载失败',
            description: errMessage,
            duration: 2
        });
    }

    createProjectSet(){
        this.context.router.push({
            pathname: '/createProjectSet',
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
        node.selectedItemId=node.id.substring(0,node.id.length-2);
        this.props.putProjectSetToState(node);
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
        const {projectSet, loading, currentTwoInfo,errMessage} = this.props;
        return (
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
                                            onClick={this.createProjectSet.bind(this,'add',null)}>创建虚拟组</Button>
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
        loading: state.fetchProjectSetTree.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        putProjectSetToState: bindActionCreators(putProjectSetToState, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(projectSetTree);