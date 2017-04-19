/**
 * Created by Administrator on 2017/4/17.
 */
import React,{ PropTypes } from 'react';
import { Button, Form ,Modal, Input,Spin, notification,message} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addBacklogNode} from './actions/backlog-actions';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class AddBacklogNode extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    insertCallback(messageInfo){
        message.info(messageInfo,3);
    }

    componentWillReceiveProps(nextProps) {
        const {addResult,setVisible} = this.props;
        if(nextProps.addResult && addResult && nextProps.addResult.result
            && nextProps.addResult.result !=addResult){
            this.insertCallback("添加节点成功！");
            if(setVisible){
                setVisible(false);
            }
        }
    }

    handleCancel() {
        const {form,setVisible} = this.props;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                form.resetFields();
                if(setVisible){
                    setVisible(false);
                }
            },
            onCancel() {
                //do nothing
            }
        })
    }

    handleSubmit(e) {
        const {form,logInfo } = this.props;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                this.props.addBacklogNode(formData);
            }
        })
    }

    render(){
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        return (
            <Modal title={this.props.editType=='add'?'添加子节点':'修改节点'} visible={this.props.visible}
                   onOk={this.handleSubmit.bind(this)}  onCancel={this.handleCancel.bind(this)}
            >
                <Form horizontal >
                    <FormItem {...formItemLayout}  label="名称" >
                        {getFieldDecorator('title')(<Input placeholder="请输入名称" />)}
                    </FormItem>

                    <FormItem {...formItemLayout}  label="描述" >
                        {getFieldDecorator('description')(<Input type="textarea" rows={4} placeholder="请输入描述" />)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

AddBacklogNode.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        logInfo: state.login.profile,
        addResult:state.backlogReducer.addBacklogNode
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addBacklogNode: bindActionCreators(addBacklogNode, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(AddBacklogNode));