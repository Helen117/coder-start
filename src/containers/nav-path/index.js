/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React, {PropTypes} from 'react';
import {Breadcrumb} from 'antd';
import {connect} from 'react-redux';
import {Link} from 'react-router';

//import menuUtils from '../../utils/menu';

import './index.less';

class NavPath extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {navpath} = this.props;

        // let rightNavPath = menuUtils.getNavPath()
        // rightNavPath = navpath.length>0 ? navpath:rightNavPath;

        const bread = navpath.map((item)=> {
            return (
                <Breadcrumb.Item key={'bc-' + item.key}>{item.name}</Breadcrumb.Item>
            )
        });

        return (
            <div className="ant-layout-breadcrumb">
                <Breadcrumb>
                    {/*<Breadcrumb.Item key='bc-0'><Link to={'/home'} state={null}>首页</Link></Breadcrumb.Item>*/}
                    {bread.length>0?bread:(<Breadcrumb.Item key='bc-0'>首页</Breadcrumb.Item>)}
                </Breadcrumb>
                <br />
            </div>
        );
    }
}

NavPath.propTypes = {
    navpath: PropTypes.array
};

NavPath.defaultProps = {
    navpath: []
};

function mapStateToProps(state) {
    return {
        navpath: state.menu.navpath
    };
}

export default connect(mapStateToProps)(NavPath);
