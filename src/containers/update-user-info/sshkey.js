/**
 * Created by Administrator on 2016-11-18.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification} from 'antd';
import 'pubsub-js';
import {AddSshKeys,GetSshKeys} from './actions/update-user-info-action';
import SshKeyList from './sshkey-list';
import {checkNameSpace} from '../../utils/regValidate';

const FormItem = Form.Item;

class UpdateSshKey extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form,loginInfo,actions } = this.props;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                let sshKey_temp;
                sshKey_temp = formData.sshKey.replace(/\+/g,"%2B");
                sshKey_temp = sshKey_temp.replace(/\&/g,"%26");
                //调修改SSHKEY接口
                actions.AddSshKeys(loginInfo.username,formData.title,sshKey_temp)
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
            duration: 3
        });
        const {form,actions,loginInfo} = this.props;
        form.resetFields();
        actions.GetSshKeys(loginInfo.userId)
    }

    componentWillReceiveProps(nextProps) {
        const {AddSshkey} = nextProps;
        //添加返回信息
        if(this.props.AddSshkey && AddSshkey){
            if (this.props.AddSshkey.addResult != AddSshkey.addResult && AddSshkey.addResult) {
                this.insertCallback("添加成功");
            }
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
                {validator: checkNameSpace.bind(this)}
            ]})(<Input type="textarea" rows="4" placeholder="请输入上面步骤3打开的内容！"/>);
        const titleProps = getFieldDecorator('title')(<Input type="text" placeholder="请输入SSH Key标题！"/>);

        if(visible){
            return(
                <div style={{paddingLeft:'50px'}}>
                    <SshKeyList/>
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
        AddSshkey:state.UpdateUserInfo.AddSshkey,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({AddSshKeys,GetSshKeys}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSshKey);