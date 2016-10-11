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
                <div className="menu-bar-2nd-bg">
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
                </div>
                <div className="menu-bar-3rd-bg">
                    <div style={{clear:'both'}}/>
                    <div className="menu-bar-wrapper">
                        <Menu mode="horizontal" className="menu-bar-3rd">
                            <Menu.Item key="mail">
                                <Icon type="mail" />三级菜单1
                            </Menu.Item>
                            <Menu.Item key="app">
                                <Icon type="appstore" />三级菜单2
                            </Menu.Item>
                            <Menu.Item key="app2">
                                <Icon type="appstore" />三级菜单3
                            </Menu.Item>
                            <Menu.Item key="app3">
                                <Icon type="appstore" />三级菜单4
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </div>
        );
    }

}