/**
 * Created by helen on 2017/4/1.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,Icon,notification,Spin,Row, Col} from 'antd';
import moment from 'moment';
import {bindActionCreators} from 'redux';

import TransferFilter from '../../components/transfer-filter';

import {connect} from 'react-redux';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class ProjectConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    handleSubmit() {
        const {form, loginInfo} = this.props;
        const setProjectVisible = this.props.setProjectVisible;

        form.validateFields((errors) => {
                if (!!errors) {
                    return;
                } else {
                    setProjectVisible(false);
                    form.resetFields();
                }
            }
        )
    }

    handleCancel() {
        const {form} = this.props;
        const setProjectVisible = this.props.setProjectVisible;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                setProjectVisible(false);
                form.resetFields();
            },
            onCancel() {
                //do nothing
            }
        })
    }

    beforeUpload(file) {
        var len = file.name.length;
        // if (!(file.name.substr(len-4,4).toLowerCase() == '.doc')) {
        //     message.error('上传的需求文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
        //     return false;
        // }
        if (file.size / 1024 / 1024 > 10) {
            message.error('文件大小不能超过10M', 3);
            return false;
        }

        if (file.size == 0) {
            message.error('不能上传空文件', 3);
            return false;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            this.setState({
                fileList: [{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: reader.result
                }]
            });
        }.bind(this);
        reader.readAsDataURL(file);
        return false;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        };
        const loading=false;

        return (
            <Modal title='选择项目'
                   width="70%"
                   visible={this.props.projectVisible}
                   onOk={this.handleSubmit.bind(this)}
                   //confirmLoading={loading}
                   onCancel={this.handleCancel.bind(this)}
            >
                <Form horizontal>
                    <FormItem   {...formItemLayout} label="涉及项目">
                        {getFieldDecorator('projects', {rules: [{required: true, type: "array", message: '请选择项目'}]})(
                            <TransferFilter
                                dataSource=''
                                // onChange={this.handleChange.bind(this)}
                                loadingProMsg={loading}
                                targetKeys=''
                            />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="文档上传">
                        {getFieldDecorator('files')(
                            <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                <Button type="ghost">
                                    <Icon type="upload"/> 点击上传
                                </Button>
                            </Upload>)}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}



ProjectConfirm.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectConfirm = Form.create()(ProjectConfirm);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        
    };
}

function mapDispatchToProps(dispatch){
    return{
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProjectConfirm);