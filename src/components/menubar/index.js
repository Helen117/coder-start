/**
 * Created by Administrator on 2016-10-11.
 */
import React from 'react';
import {Link} from 'react-router';
import { Menu, Icon } from 'antd';
import './index.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class MenuBar extends React.Component {
    constructor(){
        super();
        this.state = {
            currentMenuOne:"topMenu0",
        }
    }
    clickMenuOne(e){
        this.setState({
            currentMenuOne:e.key
        })
    }

    render(){
        const {menuData, navpath} = this.props;
        let selectNaviOne = [];
        for(var i=0;i<menuData.length;i++){
            if(navpath.length != 0){
                if(navpath[0].key == menuData[i].id){
                    selectNaviOne[0] = menuData[i];
                }
            }
        }
        const topMenu = selectNaviOne.map((item) => {
            if(item.subMenu){
                if(item.subMenu.length == 0){
                    return null;
                }else {
                    var topMenuCount = 0;
                    let topMenuData = item.subMenu;
                    const menuOneData = topMenuData.map(( itemTop ) => {
                        return (
                            <Menu.Item key={'topMenu' + topMenuCount++}>
                                <Link to={itemTop.link}>{itemTop.name}</Link>
                            </Menu.Item>
                        )
                    })
                    return menuOneData;
                }
            }
        });
        var haveMenuOne = false;
        if(selectNaviOne.length != 0){
            if(selectNaviOne[0].subMenu){
                if(selectNaviOne[0].subMenu.length != 0){
                    haveMenuOne = true;
                }
            }
        }

        return (
            <div className="menu-area">
                <div className="menu-bar-wrapper">
                    <Menu mode="horizontal" className="menu-bar"
                        selectedKeys={haveMenuOne ? [this.state.currentMenuOne] : null}
                        onClick={this.clickMenuOne.bind(this)}>
                        {topMenu}
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