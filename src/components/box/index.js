/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/6 13:37
 */
import React from 'react';
import {Row, Col, Button} from 'antd';

import './index.less';

export default class MyBox extends React.Component{
    constructor (props) {
        super(props);
    }

    render(){
        const {title, action, headerStyle} = this.props;
        let {classType} = this.props;
        if (!classType){
            classType = 'bd';
        }
        return (
            <div className="ant-layout-content">
                <div className={`ant-layout-content-header ${classType}`} style={headerStyle}>
                    <Row>
                        <Col span={16}>
                            <span className="title">{title}</span>
                        </Col>
                        <Col span={8} style={{textAlign:'right'}}>
                            {action}
                        </Col>
                    </Row>
                </div>
                <div className="ant-layout-content-box">
                    {this.props.children}
                </div>
            </div>
        );
    }

}
