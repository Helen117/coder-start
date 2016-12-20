/**
 * Created by Administrator on 2016-11-18.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, notification,Modal,Row,Col,Icon,Collapse} from 'antd';
import 'pubsub-js';
import {GetSshKeys,DeleteSshKeys} from './actions/update-user-info-action';

const confirm = Modal.confirm;
const Panel = Collapse.Panel;

class SshKeyList extends React.Component {
    constructor(props) {
        super(props);
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

    componentWillMount(){
        const {loginInfo,actions} = this.props;
        //调展示sshkey接口
        actions.GetSshKeys(loginInfo.userId)
    }

    componentWillReceiveProps(nextProps) {
        const {DeleteSshkey} = nextProps;
        //删除返回信息
        if(this.props.DeleteSshkey && DeleteSshkey){
            if (this.props.DeleteSshkey.deleteResult != DeleteSshkey.deleteResult
                && DeleteSshkey.deleteResult) {
                this.insertCallback("删除成功");
            }
        }
    }

    onClick(key_id,e){
        e.stopPropagation();
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
        const {GetSshkey} = this.props;
        let keyProps = (<Panel></Panel>);
        if(GetSshkey){
            if(GetSshkey.getResult){
                keyProps = GetSshkey.getResult.map((item)=>{
                    let panelTitle = (
                        <div style={{fontSize:14}}>
                            <Col span={21}>{item.title}</Col>
                            <Col span={1}></Col>
                            <Col span={1}>
                                <Icon type="delete" onClick={this.onClick.bind(this,item.id)}/>
                            </Col>
                        </div>
                    );
                    return (<Panel header={panelTitle} key={item.id} >
                        <Input type="textarea" value={item.key} rows="4" readOnly />
                    </Panel>)
                })
            }
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
        GetSshkey:state.UpdateUserInfo.GetSshkey,
        DeleteSshkey:state.UpdateUserInfo.DeleteSshkey,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({GetSshKeys,DeleteSshKeys}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SshKeyList);