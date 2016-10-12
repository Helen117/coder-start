/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React, {PropTypes} from 'react';
import {Form, Input, Button, Row, Col, notification} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {login} from './actions/login-action';
//import 'js-cookie';
import * as Cookies from "js-cookie";

const FormItem = Form.Item;

import './index.less';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const error = nextProps.loginErrors;
        const isLoggingIn = nextProps.loggingIn;
        const uid = nextProps.uid;

        if (error != this.props.loginErrors && error) {

            notification.error({
                message: '登录失败',
                description: error,
                duration: 5
            });
        }

        if (!isLoggingIn && !error && uid) {
            notification.success({
                message: '登录成功',
                description: '',
                duration: 1
            });
        }
        if (uid) {
            Cookies.set('uid', uid);
            Cookies.set('profile', nextProps.profile);
            this.context.router.replace('/home.html');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions} = this.props;

        const data = this.props.form.getFieldsValue();

        if(data.user && data.password){
            actions.login(data.user, data.password);
        }else{
            notification.error({
                message: '登录失败',
                description: '请输入正确的用户名、密码',
                duration: 3
            });
        }

    }

    register(){
        this.context.router.replace('/register.html');
    }

    render() {
        const {getFieldProps} = this.props.form;
        return (
            <Row className="login-row" type="flex" justify="space-around" align="middle">
                <Col span="8">
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <FormItem label='用户名：' labelCol={{span: 6}} wrapperCol={{span: 14}}>
                            <Input placeholder='请输入账号' {...getFieldProps('user')} />
                        </FormItem>
                        <FormItem label='密码：' labelCol={{span: 6}} wrapperCol={{span: 14}}>
                            <Input type='password' placeholder='请输入密码' {...getFieldProps('password')} />
                        </FormItem>
                        <Row>
                            <Col span='16' offset='6'>
                                <Button type='primary' htmlType='submit' loading={this.props.loggingIn}>确定</Button>
                                <Button type='primary' onClick={this.register.bind(this)}>注册</Button>

                            </Col>

                        </Row>
                    </Form>
                </Col>
            </Row>
        );
    }
}

Login.contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

Login.propTypes = {
    uid: PropTypes.number,
    loggingIn: PropTypes.bool,
    loginErrors: PropTypes.string
};

Login = Form.create()(Login);

function mapStateToProps(state) {
    const {login} = state;
    if (login.uid) {
        return {uid: login.uid, loggingIn: login.loggingIn, loginErrors: '', profile:login.profile};
    }
    return {uid: null, loggingIn: login.loggingIn, loginErrors: login.loginErrors, profile:login.profile};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({login}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);