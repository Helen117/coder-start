import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, Affix } from 'antd';
import RelationMap from './RelationMap';
import Box from '../../components/box';
import './index.less';

class Backlog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    addChildNode(){
        alert('addChildNode');
    }
    deleteNode(){
        const node = this.refs.relationMap.getSelectNode();
        if (node){
            alert(node.name);
        }else{
            alert('请选择节点');
        }
    }
    refreshNodes(){
        alert('refreshNodes');
    }

    render(){

        const data = [{"name":"flare111","children":[{"name":"analytics","children":[{"name":"cluster","children":[{"name":"AgglomerativeCluster","size":3938},{"name":"CommunityStructure","size":3812},{"name":"HierarchicalCluster","size":6714},{"name":"MergeEdge","size":743}]},{"name":"graph","children":[{"name":"BetweennessCentrality","size":3534},{"name":"LinkDistance","size":5731},{"name":"MaxFlowMinCut","size":7840},{"name":"ShortestPaths","size":5914},{"name":"SpanningTree","size":3416}]},{"name":"optimization","children":[{"name":"AspectRatioBanker","size":7074}]}]},{"name":"animate","children":[{"name":"Easing","size":17010},{"name":"FunctionSequence","size":5842},{"name":"interpolate","children":[{"name":"ArrayInterpolator","size":1983},{"name":"ColorInterpolator","size":2047},{"name":"DateInterpolator","size":1375},{"name":"Interpolator","size":8746},{"name":"MatrixInterpolator","size":2202},{"name":"NumberInterpolator","size":1382},{"name":"ObjectInterpolator","size":1629},{"name":"PointInterpolator","size":1675},{"name":"RectangleInterpolator","size":2042}]},{"name":"ISchedulable","size":1041},{"name":"Parallel","size":5176},{"name":"Pause","size":449},{"name":"Scheduler","size":5593},{"name":"Sequence","size":5534},{"name":"Transition","size":9201},{"name":"Transitioner","size":19975},{"name":"TransitionEvent","size":1116},{"name":"Tween","size":6006}]}]}];

        const action = <div>
            <Button type="primary" size="default" onClick={this.deleteNode.bind(this)}>删除节点</Button>
            <Button type="primary" size="default" onClick={this.addChildNode.bind(this)}>添加子节点</Button>
            <Button type="primary" size="default" onClick={this.refreshNodes.bind(this)}>刷新</Button>
        </div>;

        return (
            <div id="backlog">
                <Row>
                    <Col span={4}>
                    </Col>
                    <Col span={20}>
                        <Box title="backlog关系图" action={action}>
                            <RelationMap ref="relationMap" data={data}/>
                        </Box>
                    </Col>
                </Row>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Backlog);