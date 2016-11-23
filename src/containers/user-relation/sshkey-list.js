/**
 * Created by Administrator on 2016-11-18.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification,Modal,Row,Col,Icon,Collapse} from 'antd';
import 'pubsub-js';
import {AddSshKey,GetSshKeys,DeleteSshKeys} from './actions/ssh-key-action';
import styles from './index.css';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Panel = Collapse.Panel;

class SshKeyList extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    insertCallback(message){
        notification.success({
            message: message,
            description: '',
            duration: 2
        });
        //调展示sshkey接口
        const {actions,loginInfo} = this.props;
        actions.GetSshKeys(loginInfo.userId)
    }

    errCallback(message,errmessage){
        notification.error({
            message: message,
            description:errmessage,
            duration: null
        });
    }

    componentWillMount(){
        const {loginInfo,actions} = this.props;
        //调展示sshkey接口
        actions.GetSshKeys(loginInfo.userId)
    }

    componentWillReceiveProps(nextProps) {
        const {deleteResult, deleteErrors} = nextProps;
        //删除返回信息
        if (this.props.deleteResult != deleteResult && deleteResult) {
            this.insertCallback("删除成功");
        /*} else if (this.props.deleteErrors != deleteErrors && deleteErrors) {
            this.errCallback("删除失败",deleteErrors);*/
        }
    }

    deleteSshKey(key_id){
        const {actions,loginInfo} = this.props;
        confirm({
            title: '您是否确定要删除此SshKey？',
            content: '',
            onOk() {
                actions.DeleteSshKeys(loginInfo.userId,key_id)
            },
            onCancel() {
            }
        })
    }

    render() {
        const {sshkeys} = this.props;
        let keyProps = (<Panel></Panel>);
        if(sshkeys){
            keyProps = sshkeys.map((item)=>{
                let panelTitle = (
                    <div style={{fontSize:14}}>
                        <Col span={1}>{item.title}</Col>
                        <Col span={1}></Col>
                        <Col span={1}>
                            <Icon type="delete" onClick={this.deleteSshKey.bind(this,item.id)}/>
                        </Col>
                    </div>
                );
                return (<Panel header={panelTitle} key={item.id} >
                    <Input type="textarea" value={item.key} rows="4" readOnly />
                </Panel>)
            })
        }

        return(
            <div>
                <p style={{fontSize:14}}>
                    你的SSH Keys:
                </p>
                <Collapse>
                    {keyProps}
                </Collapse>
            </div>
        )
    }
}

SshKeyList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


SshKeyList = Form.create()(SshKeyList);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        sshkeys:state.GetSshKeys.Result,
        Errors:state.GetSshKeys.Errors,
        Loading:state.GetSshKeys.Loading,
        Disabled:state.GetSshKeys.Disabled,
        deleteResult:state.AddSshKey.deleteResult,
        deleteErrors:state.AddSshKey.deleteErrors,
        deleteLoading:state.AddSshKey.deleteLoading,
        deleteDisabled:state.AddSshKey.deleteDisabled,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({AddSshKey,GetSshKeys,DeleteSshKeys}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SshKeyList);