/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/4
 */
import React from 'react';

import './index.less';

export default class Footer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="ant-layout-footer">
                亚信科技（中国）有限公司 版权所有 © 2016
                <a href="http://www.asiainfo.com" target="_blank">
                    &nbsp; AsiaInfo
                </a>
            </div>
        );
    }
}
