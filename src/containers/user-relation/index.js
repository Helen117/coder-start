/**
 * Created by Administrator on 2016-11-07.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import TreeFilter from '../../components/tree-filter';
import {getUserRelationTree} from './actions/user-relation-tree-action';

class UserRelation extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const {userTreeData} = this.props;
        if(userTreeData.length == 0){
            this.props.getUserRelationTree();
        }
    }

    onSelectNode(node){
        console.log("node:",node)
        this.context.router.push({
            pathname: '/userRelation/userInfo',
        });
    }

    render(){
        const {userTreeData, loading} = this.props;

        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <TreeFilter
                        loading={loading}
                        notFoundMsg='找不到项目'
                        inputPlaceholder="快速查询项目"
                        loadingMsg="正在加载项目信息..."
                        nodesData={userTreeData}
                        onSelect={this.onSelectNode.bind(this)}/>
                </Col>
                <Col span={18}>
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserRelationTree:bindActionCreators(getUserRelationTree, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRelation);