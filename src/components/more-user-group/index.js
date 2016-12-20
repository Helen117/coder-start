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
        };
    }

    componentWillReceiveProps(nextProps){
        const {modalVisible} = nextProps;
        this.setState({
            modalVisible:modalVisible
        })
    }

    handleOk(){
        const {handleOk,form,selectedMoreGroup} = this.props;
        if(selectedMoreGroup){
            if(handleOk){
                handleOk(selectedMoreGroup);
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
        const {cancelChoose,form,selectedMoreGroup} = this.props;
        if(cancelChoose){
            cancelChoose(selectedMoreGroup);
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
                    notFoundMsg='找不到组织'
                    inputPlaceholder="快速查询组织"
                    loadingMsg="正在加载组织信息..."
                    nodesData={nodesData}
                    busiType="more-user-group"/>
            </Modal>
        )
    }
}

export default  MoreUserGroup = Form.create()(MoreUserGroup);