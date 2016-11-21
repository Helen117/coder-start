/**
 * Created by Administrator on 2016-11-09.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ReactDOM from "react-dom";
import {Form, Input, Button,Icon,Row,Col} from 'antd';
import Box from '../../components/box';
import 'pubsub-js';
import styles from './index.css';
import UpdatePassword from './update-password';
import UpdateBasicInfo from './update-basic-info';
import UpdateSshKey from './update-sshkey';

const FormItem = Form.Item;

class UpdateUserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex:-1,
            showPassword:false,
            showBasicInfo:false,
            showSshKey:false,
        }
    }

    updateBasicInfo(){
        this.setState({
            currentIndex:0,
            showPassword:false,
            showBasicInfo:true,
            showSshKey:false,
        })
    }

    updatePassword(){
        this.setState({
            currentIndex:1,
            showPassword:true,
            showBasicInfo:false,
            showSshKey:false,
        })
    }

    updateRole(){
        this.setState({
            currentIndex:2,
            showPassword:false,
            showBasicInfo:false,
            showSshKey:false,
        })
    }

    updateSshKey(){
        this.setState({
            currentIndex:3,
            showPassword:false,
            showBasicInfo:false,
            showSshKey:true,
        })
    }

    handleClick(e){
        //console.log("e",e)
        /*console.log("e.target:",e.target)
         let node = ReactDOM.findDOMNode(this);
         console.log("node:",node)*/
    }

    render() {

        return(
            <Box title="修改员工信息">
                <Row>
                    <Col span={5}>
                        <ul className={styles.update_ul} onClick={this.handleClick.bind(this)}>
                            <li className={this.state.currentIndex==0?styles.update_li_light:styles.update_li}
                                onClick={this.updateBasicInfo.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                修改基本信息</li>
                            <li className={this.state.currentIndex==1?styles.update_li_light:styles.update_li}
                                onClick={this.updatePassword.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                修改密码</li>
                            <li className={this.state.currentIndex==2?styles.update_li_light:styles.update_li}
                                onClick={this.updateRole.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                修改角色</li>
                            <li className={this.state.currentIndex==3?styles.update_li_light:styles.update_li}
                                onClick={this.updateSshKey.bind(this)}>
                                <Icon type="edit" className={styles.ul_li_icon}/>
                                SSH Keys</li>
                        </ul>
                    </Col>
                    <Col span={19}>
                        <UpdatePassword visible={this.state.showPassword}/>
                        <UpdateBasicInfo visible={this.state.showBasicInfo}/>
                        <UpdateSshKey visible={this.state.showSshKey}/>
                        {this.props.children}
                    </Col>
                </Row>
            </Box>
        )
    }
}

UpdateUserInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UpdateUserInfo = Form.create()(UpdateUserInfo);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserInfo);