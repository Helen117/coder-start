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
import {Menu, Icon} from 'antd';
import {Link} from 'react-router';
import {getAllMenu, updateNavPath} from './actions/menu-action';
//import authUtils from '../../utils/auth'
import './index.less';

const SubMenu = Menu.SubMenu;

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //let uid = authUtils.getUid();
        let {uid} = this.props;
        this.props.getAllMenu(uid);
    }

    menuClickHandle(item) {
        this.props.updateNavPath(item.keyPath, item.key);
    }

    render() {
        const {items} = this.props;

        let openKey = [];

        const menu = items.map((item) => {
            openKey.push('sub' + item.id);
            return (
                <SubMenu key={'sub' + item.id} title={<span><Icon type='user'/>{item.name}</span>}>
                    {item.subMenu.map((node) => {
                        return (
                            <Menu.Item key={'menu' + node.id}>
                                <Link to={node.link}>{node.name}</Link>
                            </Menu.Item>
                        );
                    })}
                </SubMenu>
            )
        });
        return (
            <aside className="ant-layout-sider">
                {/*<div className="ant-layout-logo">*/}
                {/*<img src="/src/static/images/mnj-logo30.png" />*/}
                {/*<font size="3" color="#00A0E8">Antd Demo</font>*/}
                {/*</div>*/}
                <Menu mode="inline" theme="light" openKeys={openKey} onClick={this.menuClickHandle.bind(this)}>
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
