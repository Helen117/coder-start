/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React from 'react';
import {Row, Col, Icon, Menu, Dropdown} from 'antd';
import './index.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Header extends React.Component {
    constructor() {
        super();
    }

    handleClick(item) {
        if (item.key == 'setting:2') {
            this.props.logout();
        }
    }

    render() {
        const {profile} = this.props;
        const username = profile ? profile.userName : 'loading';
        return (
            <Row className='ant-layout-header'>
                <Col span={6}>
                    <img src="/assets/images/logo.png"/>
                </Col>
                <Col span={16} className="pending-item">
                    <p>
                        你好：<span>{username}</span> &nbsp;&nbsp;您今日有待办事宜 <span>{5}</span> 项，
                        当前里程碑还有待办事宜 <span>{3}</span> 项，共有待办事宜 <span>{8}</span> 项
                    </p>
                    <p>
                        当前您有 <span>{6}</span> 项待审批事项
                    </p>
                </Col>
                <Col span={2}>
                    <Menu className="header-menu" onClick={this.handleClick.bind(this)} mode="horizontal">
                        <SubMenu title={<span><Icon type="user"/>{username}</span>}>
                            <Menu.Item key="setting:1">修改密码</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="setting:2">登出</Menu.Item>
                        </SubMenu>
                        {/*<Menu.Item key="mail">*/}
                        {/*<Icon type="question"/>帮助*/}
                        {/*</Menu.Item>*/}
                    </Menu>
                </Col>
            </Row>
        );
    }

}
