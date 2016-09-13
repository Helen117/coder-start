/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/9
 */
import React from 'react';
import {Icon} from 'antd';

import './index.less';

export default class ThumbnailView extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {caption, content} = this.props;
        return (
            <div className="thumbnail">
                {/*<img src="/wp-content/uploads/2014/06/kittens.jpg" alt="通用的占位符缩略图"/>*/}
                <Icon type="star" />
                    <div className="caption">
                        <h3>{caption}</h3>
                        <p>{content}</p>
                        {/*<p>*/}
                        {/*<a href="#" class="btn btn-primary" role="button">按钮</a>*/}
                        {/*<a href="#" class="btn btn-default" role="button">按钮</a>*/}
                        {/*</p>*/}
                    </div>
            </div>
        );
    }
}