/**
 * Created by Administrator on 2017/3/30.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col } from 'antd';
import 'pubsub-js';
import AsyncTree from './async-tree';

class TaskBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }
//state:{"storyId": storyId}
    selectedNode(node){
        console.log('node:',node)
        this.context.router.push({
            pathname: "/taskBoard/story",
            state:{milestoneId: node}
        });
    }


    render(){

        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <AsyncTree onSelect={this.selectedNode.bind(this)}/>
                </Col>
                <Col span={18}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }

}

TaskBoard.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskBoard);