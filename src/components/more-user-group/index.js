/**
 * Created by Administrator on 2016-11-09.
 */
import React, {PropTypes} from 'react';
import {Modal, Icon, Form, Input,message} from 'antd';
import styles from './index.css';
import TreeFilter from '../tree-filter';

const FormItem = Form.Item;

class MoreUserGroup extends React.Component{
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
        const {handleOk,form} = this.props;
        if(this.state.selectedNode){
            if(handleOk){
                handleOk(this.state.selectedNode);
            }
            form.resetFields();
            this.setState({
                modalVisible:false,
            })
        }else{
            message.error('请选择目标组织!',3);
        }
    }

    cancelChoose(){
        const {cancelChoose,form} = this.props;
        if(cancelChoose){
            cancelChoose(this.state.selectedNode);
        }
        form.resetFields();
        this.setState({
            modalVisible:false,
        })
    }

    render(){
        const {loading, nodesData} = this.props;
        const {getFieldDecorator} = this.props.form;
        const reasonProps = getFieldDecorator('reason',
            {})(<Input type="textarea" rows={2} />);

        return(
            <Modal title="组织选择"
                   visible={this.state.modalVisible}
                   onOk={this.handleOk.bind(this)}
                   onCancel={this.cancelChoose.bind(this)}
                   confirmLoading={this.props.confirmLoading}
            >
                <span>请输入原因：</span>
                <FormItem>
                    {reasonProps}
                </FormItem>
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

export default  MoreUserGroup = Form.create()(MoreUserGroup);