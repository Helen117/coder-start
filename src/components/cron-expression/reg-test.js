/**
 * Created by Administrator on 2016-11-25.
 */
import React, {PropTypes} from 'react';
import {Select,Radio,Input,Form,Button,Row,Modal} from 'antd';

import CronExpression from './index';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class RegTest extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    setCron(expression){
        const { setFieldsValue } = this.props.form;
        setFieldsValue({'regtest':expression})
    }

    render(){
        const { getFieldDecorator,getFieldValue } = this.props.form;

        return(
            <div>
                {getFieldDecorator('regtest')(
                    <Input />
                )}
                <CronExpression expression={getFieldValue('regtest')}
                                setCron={this.setCron.bind(this)}/>
            </div>
        )
    }
}

export default RegTest = Form.create()(RegTest);