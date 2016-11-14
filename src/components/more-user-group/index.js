/**
 * Created by Administrator on 2016-11-09.
 */
import React, {PropTypes} from 'react';
import {Modal, Icon} from 'antd';
import styles from './index.css';
import TreeFilter from '../tree-filter';

export default class MoreUserGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalVisible:null,
            selectedNode:null,
        };
    }

    componentWillReceiveProps(nextProps){
        const {modalVisible} = nextProps;
        this.setState({
            modalVisible:modalVisible
        })
    }

    onSelectNode(node){
        this.setState({
            selectedNode:node,
        })
    }

    handleOk(){
        const {handleOk} = this.props;
        if(handleOk){
            handleOk(this.state.selectedNode);
        }
        this.setState({
            modalVisible:false,
        })
    }

    cancelChoose(){
        const {cancelChoose} = this.props;
        if(cancelChoose){
            cancelChoose(this.state.selectedNode);
        }
        this.setState({
            modalVisible:false,
        })
    }

    render(){
        const {loading, nodesData} = this.props;

        return(
            <Modal title="组织选择"
                   visible={this.state.modalVisible}
                   onOk={this.handleOk.bind(this)}
                   onCancel={this.cancelChoose.bind(this)}
            >
                <TreeFilter
                    loading={loading}
                    notFoundMsg='找不到项目'
                    inputPlaceholder="快速查询项目"
                    loadingMsg="正在加载项目信息..."
                    nodesData={nodesData}
                    onSelect={this.onSelectNode.bind(this)}/>
            </Modal>
        )
    }
}