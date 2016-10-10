/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Menu, Icon, Button, Affix} from 'antd';
import {Link} from 'react-router';
import {getAllMenu, updateNavPath} from './actions/menu-action';
//import authUtils from '../../utils/auth'
import './index.less';

const SubMenu = Menu.SubMenu;

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openSideBar:false
        };
    }

    componentDidMount() {
        //let uid = authUtils.getUid();
        let {uid} = this.props;
        this.props.getAllMenu(uid);
        /*this.setState({
            openSideBar:isOpened
        });*/
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            openSideBar:nextProps.isOpened
        });
    }

    menuClickHandle(item) {
        console.log("menuClick:",item);
        this.props.updateNavPath(item.keyPath, item.key);
    }

    clickSideBar(){
        this.setState({
            openSideBar:this.state.openSideBar ? false : true
        });
         const {clickSideBar} = this.props;
         if (clickSideBar){
             clickSideBar(!this.state.openSideBar);
         }
    }

    render() {
        //console.log("this.state.openSideBar:",this.state.openSideBar);
        const {items} = this.props;
        let openKey = [];
        let selectedKeys = ['menu1'];

        const menu = items.map((item) => {
            openKey.push('sub' + item.id);
            return (
                <Menu.Item key={'menu' + item.id}>
                    <Link to={item.link}><Icon type='user'/>{item.name}</Link>
                </Menu.Item>
            )
            // return (
            //     <SubMenu key={'sub' + item.id} title={<span><Icon type='user'/>{item.name}</span>}>
            //         {item.subMenu.map((node) => {
            //             return (
            //                 <Menu.Item key={'menu' + node.id}>
            //                     <Link to={node.link}>{node.name}</Link>
            //                 </Menu.Item>
            //             );
            //         })}
            //     </SubMenu>
            // )
        });
        return (
            <aside className={this.state.openSideBar ? "ant-layout-sider" : "ant-layout-sider-off"}  onMouseLeave={this.clickSideBar.bind(this)}>
                {/*<div className="ant-layout-logo">*/}
                {/*<img src="/src/static/images/mnj-logo30.png" />*/}
                {/*<font size="3" color="#00A0E8">Antd Demo</font>*/}
                {/*</div>*/}
                {/*<Button type="Ghost" shape="circle" icon="bars"*/}
                        {/*onClick={this.clickSideBar.bind(this)}/>*/}
                <Icon className="action-button-sidebar"
                      type="bars"
                      onClick={this.clickSideBar.bind(this)}/>
                <Menu mode="inline" theme="light" openKeys={openKey} defaultSelectedKeys={selectedKeys} onSelect={this.menuClickHandle.bind(this)}>
                    {menu}
                </Menu>
            </aside>
        );
    }
}

Sidebar.propTypes = {
    items: PropTypes.array,
    currentIndex: PropTypes.number
};

Sidebar.defaultProps = {
    items: [],
    currentIndex: 0
};

function mapStateToProps(state) {
    return {
        items: state.menu.items,
        currentIndex: state.menu.currentIndex
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllMenu: bindActionCreators(getAllMenu, dispatch),
        updateNavPath: bindActionCreators(updateNavPath, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
