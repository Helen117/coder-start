/**
 * Created by Administrator on 2016-11-25.
 */
import React, {PropTypes} from 'react';
import {Select,Radio,Input,Form,Button,Row,Modal} from 'antd';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class CronExpression extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            radioValue:1,
            visible:false,
        }
    }

    showModal(){
        this.setState({
            visible: true,
        });
    }

    componentWillReceiveProps(nextProps){
        const {expression} = nextProps;
        const {setFieldsValue} = this.props.form;
        let reg_minute = /^([0-5]?\d)(,([0-5]?\d))*$/;
        let reg_hour = /^(2[0-3]|[0-1]?\d)(,(2[0-3]|[0-1]?\d))*$/;
        if(expression != this.props.expression && expression){
            let expression_array = expression.split(' ');
            if(expression_array[2]!='*' || expression_array[3]!='*'
                || expression_array[4]!='*'){
                this.setState({
                    radioValue:2,
                })
                setFieldsValue({
                    expression:expression,
                    minute:[],
                    hour:[]
                });
            }else if(!reg_minute.test(expression_array[0]) || !reg_hour.test(expression_array[1])){
                this.setState({
                    radioValue:2,
                })
                setFieldsValue({
                    expression:expression,
                    minute:[],
                    hour:[]
                });
            }else{
                let minute = expression_array[0].split(',');
                let hour = expression_array[1].split(',');
                this.setState({
                    radioValue:1,
                })
                setFieldsValue({
                    expression:'',
                    minute:minute,
                    hour:hour
                });
            }
        }
    }

    handleChange(value) {
        this.setState({
            radioValue:1
        })
    }

    onChange(e){
        this.setState({
            radioValue:e.target.value
        })
    }

    changeInput(){
        this.setState({
            radioValue:2
        })
    }

    formatCronexpression(cron){
        let cron_array = cron.split(' ');
        let hour_temp = cron_array[1];
        let minute_temp = cron_array[0];
        let hour = hour_temp.split(',');
        let minute = minute_temp.split(',');
        let expression_desc_temp=[],expression_desc='';
        for(let i=0; i<hour.length; i++){
            for(let j=0; j<minute.length; j++){
                expression_desc_temp.push(hour[i]+'点'+minute[j]+'分')
            }
        }
        expression_desc = expression_desc_temp.join(' ');
        expression_desc = '每天： '+expression_desc+' 执行';
        return expression_desc;
    }

    handleOk(){
        this.setState({
            visible:false
        })
        const {getFieldsValue} = this.props.form;
        const {setCron} = this.props;
        let formData = getFieldsValue();
        let final_expression='',expression_desc='';
        if(this.state.radioValue == 1){
            let hour,minute;
            if(formData.hour.length==0 || formData.minute.length==0){
                final_expression=''
            }else{
                let expression_desc_temp = [];
                for(let i=0; i<formData.hour.length; i++){
                    for(let j=0; j<formData.minute.length; j++){
                        expression_desc_temp.push(formData.hour[i]+'点'+formData.minute[j]+'分')
                    }
                }
                expression_desc = expression_desc_temp.join(' ');
                expression_desc = '每天： '+expression_desc+' 执行';
                hour = formData.hour.join();
                minute = formData.minute.join();
                let cronExpression = [];
                cronExpression[0] = minute; cronExpression[1] = hour;
                cronExpression[2] = '*'; cronExpression[3] = '*'; cronExpression[4] = '*';
                final_expression = cronExpression.join(' ');
            }
        }else if(this.state.radioValue == 2){
            final_expression = formData.expression;
            expression_desc = formData.expression;
        }
        if(setCron){
            setCron(final_expression,expression_desc);
        }
    }

    handleCancle(){
        this.setState({
            visible:false
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const hour = [],minute = [];
        for (let i = 0; i < 24; i++) {
            hour.push(<Option key={i}>{i}点</Option>);
        }
        for (let i = 0; i < 60; i++) {
            minute.push(<Option key={i}>{i}分</Option>);
        }
        const radioStyle = {
            display: 'block',
            width:'300px',
            paddingTop:'10px'
        };

        return(
            <div>
                <Button type="ghost" onClick={this.showModal.bind(this)}>设置调度</Button>
                <Modal title="设置调度"
                       visible={this.state.visible}
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancle.bind(this)}
                >
                    <Row>
                        <RadioGroup onChange={this.onChange.bind(this)}
                                    value={this.state.radioValue}>
                            <Radio value={1} style={radioStyle} >
                                <span style={{paddingRight:'5px'}}>每天</span>
                                {getFieldDecorator('hour')(
                                    <Select
                                        multiple
                                        style={{ width: '50%' }}
                                        placeholder="请选择小时"
                                        onChange={this.handleChange.bind(this)}
                                    >
                                        {hour}
                                    </Select>
                                )}
                                <span>：</span>
                                {getFieldDecorator('minute')(
                                    <Select
                                        multiple
                                        style={{ width: '50%' }}
                                        placeholder="请选择分钟"
                                        onChange={this.handleChange.bind(this)}
                                    >
                                        {minute}
                                    </Select>
                                )}
                                <span style={{paddingLeft:'5px'}}>执行</span>
                            </Radio>
                            <Radio value={2} style={radioStyle} >
                                <span>自定义Cron表达式：</span>
                                {getFieldDecorator('expression')(
                                    <Input onClick={this.changeInput.bind(this)}/>
                                )}
                            </Radio>
                        </RadioGroup>
                    </Row>
                </Modal>
            </div>
        )
    }
}

export default CronExpression = Form.create()(CronExpression);