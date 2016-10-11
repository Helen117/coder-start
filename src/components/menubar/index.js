/**
 * Created by Administrator on 2016-10-11.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import { Menu, Icon } from 'antd';
import './index.less';

export default class MenuBar extends React.Component {
    constructor(){
        super();
        this.state = {
            currentMenuOne:"menuOne0",
            currentMenuTwo:"menuTwo0",
        }
    }
    selectMenuOne(e){
        console.log("e:",e);
        this.context.router.push({
            pathname: '/project-mgr.html',
        });
    }
    clickMenuOne(e){
        this.setState({
            currentMenuOne:e.key,
        })
    }
    clickMenuTwo(e){
        //console.log("e:",e);
        this.setState({
            currentMenuTwo:e.key,
        })
    }

    render(){
        const {menuData, navpath} = this.props;
        let selectNaviOne = [];var topMenu,topMenuTwo;
        for(var i=0;i<menuData.length;i++){
            if(navpath.length != 0){
                if(navpath[0].key == menuData[i].id){
                    selectNaviOne[0] = menuData[i];
                }
            }
        }
        topMenu = selectNaviOne.map((item) => {
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    var topMenuCount = 0;
                    let topMenuData = item.subMenu;
                    const menuOneData = topMenuData.map(( itemTop ) => {
                        return (
                            <Menu.Item key={'menuOne' + topMenuCount++}>
                                <Link to={itemTop.link}>{itemTop.name}</Link>
                            </Menu.Item>
                        )
                    })
                    return menuOneData;
                }
            }
        });
        topMenuTwo = selectNaviOne.map((item) => {
            if(item.subMenu){
                if(item.subMenu.length != 0){
                    let topMenuData = item.subMenu;
                    const topTwoMenu = topMenuData.map((itemTopTwo) => {
                        if(itemTopTwo.subMenu){
                            if(itemTopTwo.subMenu.length != 0){
                                var menuTwoCount = 0;
                                let menuTwoData = itemTopTwo.subMenu;
                                const topTwo = menuTwoData.map((itemTwo) => {
                                    var menuTwoKey = 'menuTwo'+menuTwoCount++;
                                    return (
                                        <li key={menuTwoKey}
                                            className={(menuTwoKey == this.state.currentMenuTwo) ? "active" : ""}>
                                            <a href={itemTwo.link}><span>{itemTwo.name}</span></a>
                                        </li>
                                    )
                                });
                                return topTwo;
                            }
                        }
                    });
                    return topTwoMenu;
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
                          selectedKeys={haveMenuOne ? [this.state.currentMenuOne] : [""]}
                          >
                        {topMenu}
                    </Menu>
                </div>
                <div style={{clear:'both'}}/>
                <div className="nav-links sub-nav">
                    <ul className="container-fluid container-limited"
                        onClick={this.clickMenuTwo.bind(this)}>
                        {topMenuTwo}
                    </ul>
                </div>
            </div>
        );
    }
}
MenuBar.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};