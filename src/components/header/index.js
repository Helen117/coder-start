/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React,{ PropTypes, Component } from 'react';
import {Row, Col, Icon, Menu, Dropdown, Button} from 'antd';
import './index.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Header extends React.Component {
    constructor() {
        super();
        this.state={
            selectedKeys:''
        }
    }

    handleClick(item) {
        if (item.key == 'setting:2') {
            this.props.logout();
        }
        if(item.key == 'setting:1'){
            this.context.router.push({
                pathname: '/updateUserInfo',
            });
        }
    }

    showSideBar(){
        this.props.showSideBar();
    }

    approveList(){
        this.context.router.push({
            pathname: '/approveList',
        });
    }

    confirmList() {
        this.context.router.push({
            pathname: '/confirmList',
        });
    }

    todoList(){
        this.context.router.push({
            pathname: '/project-mgr/myIssue',
        });
    }

    componentDidUpdate(){
        if(window.location.pathname == '/updateUserInfo'){
            this.state.selectedKeys = 'setting:1';
        }else{
            this.state.selectedKeys = '';
        }
    }

    render() {
        const {profile} = this.props;
        const username = profile ? profile.name : 'loading';
        return (
            <Row className='ant-layout-header'>
                <Col span={6}>
                    <img src="/assets/images/logo.png"/>
                </Col>
                <Col span={15} className="pending-item">
                    <p>
                        你好：<span>{username}</span> &nbsp;&nbsp;您今日有待办事宜 <span><a onClick={this.todoList.bind(this)} style={{color: 'red'}}>{this.props.items[0]}</a></span> 项，
                        当前里程碑还有待办事宜 <span><a onClick={this.todoList.bind(this)} style={{color: 'red'}}>{this.props.items[1]}</a></span> 项，共有待办事宜 <span><a onClick={this.todoList.bind(this)} style={{color: 'red'}}>{this.props.items[2]}</a></span> 项
                    </p>
                    <p>
                        当前您有 <span><a onClick={this.approveList.bind(this)} style={{color: 'red'}}>{this.props.items[3]}</a></span> 项待审批事项，
                        <span><a onClick={this.confirmList.bind(this)} style={{color: 'red'}}>{this.props.items[4]}</a></span> 项待确认事项
                    </p>
                </Col>
                <Col span={2}>
                    <Menu className="header-menu" onClick={this.handleClick.bind(this)}
                          mode="horizontal"
                          selectedKeys={[this.state.selectedKeys]}>
                        <SubMenu title={<span><Icon type="user"/>{username}</span>}>
                            <Menu.Item key="setting:1">修改信息</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="setting:2">登出</Menu.Item>
                        </SubMenu>
                        {/*<Menu.Item key="mail">*/}
                        {/*<Icon type="question"/>帮助*/}
                        {/*</Menu.Item>*/}
                    </Menu>
                </Col>
                <Col span={1}>
                    {/*<Button style={{paddingTop:15,paddingRight:15}}*/}
                            {/*type="Ghost" shape="circle" icon="bars"*/}
                            {/*onClick={this.showSideBar.bind(this)}/>*/}
                    <Icon className="action-button"
                            type="bars" onMouseOver={this.showSideBar.bind(this)}  onClick={this.showSideBar.bind(this)}
                          />
                </Col>
            </Row>
        );
    }

}

Header.contextTypes = {
    router: PropTypes.object.isRequired
};
