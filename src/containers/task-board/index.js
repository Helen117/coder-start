/**
 * Created by Administrator on 2017/3/30.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col } from 'antd';
import 'pubsub-js';
import AsyncTree from './async-tree';
import EditStory from '../story/editStory';

class TaskBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editStoryVisible:false
        };
    }

    componentDidMount() {

    }

    selectedNode(node){
        this.context.router.push({
            pathname: "/taskBoard/story",
        });
    }

    addStory(visible){
        this.setState({
            editStoryVisible:visible
        })
    }

    setVisible(visible){
        this.setState({
            editStoryVisible:visible
        })
    }


    render(){

        return (
            <Row className="ant-layout-content" style={{minHeight:300}}>
                <Col span={6}>
                    <AsyncTree onSelect={this.selectedNode.bind(this)}
                        clickAdd={this.addStory.bind(this)}/>
                </Col>
                <Col span={18}>
                    {this.props.children}
                    <EditStory visible={this.state.editStoryVisible} editType="add"
                               setVisible={this.setVisible.bind(this)}/>
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