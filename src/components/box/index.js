/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/6 13:37
 */
import React from 'react';

import './index.less';

export default class MyBox extends React.Component{
    constructor (props) {
        super(props);
    }

    render(){
        const {title} = this.props;
        return (
            <div className="ant-layout-content">
                <div className="ant-layout-content-header">
                    <span>{title}</span>
                </div>
                <div className="ant-layout-content-box">
                    {this.props.children}
                </div>
            </div>
        );
    }

}
