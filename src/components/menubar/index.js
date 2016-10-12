/**
 * Created by Administrator on 2016-10-11.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import { Menu, Icon } from 'antd';
import 'pubsub-js';
import './index.less';

export default class MenuBar extends React.Component {
    constructor(){
        super();
        this.state = {
            currentMenuOne:"menuOne0",
            currentMenuTwo:"menuTwo0",
            refreshMenuOne:false,
        }
    }

    componentDidMount() {
        PubSub.subscribe("refreshMenuOne",()=>{this.setState({
            refreshMenuOne:true,
            currentMenuOne:"menuOne0",
            currentMenuTwo:"menuTwo0",
        })});
    }

    clickMenuOne(e){
        this.setState({
            refreshMenuOne:false,
            currentMenuOne:e.key,
        })
    }
    clickMenuTwo(e){
        this.setState({
            refreshMenuOne:false,
            currentMenuTwo:e.key,
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
            var menuone_null = [];
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
                }else{return menuone_null;}
            }else{return menuone_null;}
        });
        var topMenu_1=[];
        if(topMenu.length > 0){
            if(topMenu[0].length > 0){
                topMenu_1[0] = topMenu[0];
            }
        }
        const topMenuTwo = selectNaviOne.map((item) => {
            var menutwo_null = [];
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
                                        <Menu.Item key={menuTwoKey}>
                                            <Link to={itemTwo.link}>{itemTwo.name}</Link>
                                        </Menu.Item>
                                    )
                                });
                                return topTwo;
                            }else{return menutwo_null;}
                        }else{return menutwo_null;}
                    });
                    return topTwoMenu;
                }else{return menutwo_null;}
            }else{return menutwo_null;}
        });
        var haveMenuOne = false;
        var haveMenuTwo = false;
        if(selectNaviOne.length != 0){
            if(selectNaviOne[0].subMenu){
                if(selectNaviOne[0].subMenu.length != 0){
                    haveMenuOne = true;
                    if(selectNaviOne[0].subMenu[0].subMenu){
                        if(selectNaviOne[0].subMenu[0].subMenu.length != 0){
                            haveMenuTwo = true;
                        }
                    }
                }
            }
        }
        var topMenuTwo_1=[], topMenuTwo_tmp;
        var selectMenuOne = this.state.currentMenuOne.replace("menuOne","");
        if(topMenuTwo.length > 0){
            if(topMenuTwo[0].length > 0){
                topMenuTwo_tmp = topMenuTwo[0];
                if(topMenuTwo_tmp[selectMenuOne]){
                    if(topMenuTwo_tmp[selectMenuOne].length > 0){
                        topMenuTwo_1[0] = topMenuTwo_tmp[selectMenuOne];
                    }
                }
            }
        }

        return (
            <div className="menu-area">
                {topMenu_1.length>0?(
                    <div className="menu-bar-2nd-bg">
                        <div className="menu-bar-wrapper">
                            <Menu mode="horizontal" className="menu-bar"
                                  selectedKeys={haveMenuOne ? [this.state.currentMenuOne] : [""]}
                                  onClick={this.clickMenuOne.bind(this)}>
                                {topMenu_1}
                            </Menu>
                        </div>
                    </div>
                ):(<div></div>)}
                {topMenuTwo_1.length>0?(
                    <div className="menu-bar-3rd-bg">
                        <div style={{clear:'both'}}/>
                        <div className="menu-bar-wrapper">
                            <Menu mode="horizontal" className="menu-bar-3rd"
                                  selectedKeys={haveMenuTwo ? [this.state.currentMenuTwo] : [""]}
                                  onClick={this.clickMenuTwo.bind(this)}>
                                {topMenuTwo_1}
                            </Menu>
                        </div>
                    </div>
                ):(<div className="menu-bar-bg"></div>)
                }

            </div>
        );
    }
}
MenuBar.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};