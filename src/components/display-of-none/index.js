/**
 * Created by Administrator on 2017-01-17.
 */
import React, {PropTypes,Component} from 'react';
import { Alert} from 'antd';

export default class DisplayOfNone extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return <Alert style={{margin:10}}
                      message="没有查询到数据！"
                      description=""
                      type="info"
                      showIcon
        />
    }
}