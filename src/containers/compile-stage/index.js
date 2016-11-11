/**
 * Created by helen on 2016/11/10.
 */

import React, {PropTypes,Component} from 'react';
import { Button,notification,Form,Select,DatePicker,Col,Row ,Icon,Collapse,Steps } from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const Step = Steps.Step;

 export default class CompileStage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

     readSetting(){
     }

    render() {
        return(
            <Box title="编译发布过程一览">
                <Steps size="small" style={{marginTop: 16}}>
                    <Step status="finish" title="更新代码" />
                    <Step status="process" title="编译" />
                    <Step status="wait" title="生成单元测试案例" />
                    <Step status="wait" title="代码质量扫描"/>
                    <Step status="wait" title="单元测试" />
                    <Step status="wait" title="打包" />
                    <Step status="wait" title="生成镜像"/>
                    <Step status="wait" title="发布" />
                    <Step status="wait" title="执行自动化测试"  />
                </Steps>
            </Box>
        )
    }
}
