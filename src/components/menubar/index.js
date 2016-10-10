/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/10/10
 */
import React from 'react';
import { Menu, Icon } from 'antd';
import './index.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class MenuBar extends React.Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div className="menu-area">
                <div className="menu-bar-wrapper">
                    <Menu mode="horizontal" className="menu-bar">
                        <Menu.Item key="mail">
                            <Icon type="mail" />二级菜单1
                        </Menu.Item>
                        <Menu.Item key="app">
                            <Icon type="appstore" />二级菜单2
                        </Menu.Item>
                        <Menu.Item key="app2">
                            <Icon type="appstore" />二级菜单3
                        </Menu.Item>
                        <Menu.Item key="app3">
                            <Icon type="appstore" />二级菜单4
                        </Menu.Item>
                    </Menu>
                </div>
                <div style={{clear:'both'}}/>
                <div className="nav-links sub-nav">
                    <ul className="container-fluid container-limited">
                        <li className="active">
                            <a title="Issues" href="/devops/devops-web/issues"><span>三级菜单1</span></a>
                        </li>
                        <li className="">
                            <a title="Labels" href="/devops/devops-web/labels"><span>三级菜单2</span></a>
                        </li>
                        <li className="">
                            <a title="Milestones" href="/devops/devops-web/milestones"><span>三级菜单3</span></a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

}