/**
 * Created by Administrator on 2016-11-18.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification,Modal,Row,Col} from 'antd';
import 'pubsub-js';
import {AddSshKey} from './actions/ssh-key-action';
import styles from './index.css';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class UpdateSshKey extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form,loginInfo,actions } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                let sshKey_temp;
                sshKey_temp = formData.sshKey.replace(/\+/g,"%2B");
                sshKey_temp = sshKey_temp.replace(/\&/g,"%26");
                //调修改SSHKEY接口
                actions.AddSshKey(loginInfo.username,formData.title,sshKey_temp)
            }
        })
    }

    handleCancel() {
        const {form} = this.props;
        form.resetFields();
    }

    insertCallback(message){
        notification.success({
            message: message,
            description: '',
            duration: null
        });
        const {form} = this.props;
        form.resetFields();
    }

    errCallback(message,errmessage){
        notification.error({
            message: message,
            description:errmessage,
            duration: null
        });
    }

    componentWillReceiveProps(nextProps) {
        const {addResult, addErrors} = nextProps;
        //添加返回信息
        if (this.props.addResult != addResult && addResult) {
            this.insertCallback("添加成功");
        } else if (this.props.addErrors != addErrors && addErrors) {
            this.errCallback("添加失败",addErrors);
        }
    }

    render() {
        const {visible} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 10},
        };
        const sshKeyProps = getFieldDecorator('sshKey',
            {rules:[
                {required:true, message:'请输入上面步骤3打开的内容！'},
            ]})(<Input type="textarea" rows="4" placeholder="请输入上面步骤3打开的内容！"/>);
        const titleProps = getFieldDecorator('title')(<Input type="text" placeholder="请输入SSH Key标题！"/>);

        if(visible == true){
            return(
                <div style={{paddingLeft:'50px'}}>
                    <p style={{fontSize:14}}>
                        你的SSH Keys:
                    </p>
                    <p style={{fontSize:15,paddingTop:'10px'}}>添加SSH Key步骤：
                        1、<a href="/assets/tool/Git-Bash.exe" >下载Git-Bash</a>,运行git-bash.exe;
                        2、生成密钥对：ssh-keygen -t rsa -C “你的邮箱”;
                        3、打开文件:notepad ~/.ssh/id_rsa.pub"
                    </p>
                    <Form horizontal style={{paddingTop:'10px'}} onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="SSH Key">
                            {sshKeyProps}
                        </FormItem>
                        <FormItem {...formItemLayout} label="标题">
                            {titleProps}
                        </FormItem>
                        <FormItem wrapperCol={{span: 10, offset: 5}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit"
                                    loading={this.props.addLoading}
                                    disabled={this.props.addDisabled}>
                                添加</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>重置</Button>
                        </FormItem>
                    </Form>
                </div>
            )
        }else {return <div></div>}
    }
}

UpdateSshKey.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UpdateSshKey = Form.create()(UpdateSshKey);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        addResult:state.AddSshKey.addResult,
        addErrors:state.AddSshKey.addErrors,
        addLoading:state.AddSshKey.addLoading,
        addDisabled:state.AddSshKey.addDisabled,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({AddSshKey}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSshKey);