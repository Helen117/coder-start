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
            defaultHour:[],
            defaultMinute:[],
            defaultCron:''
        }
    }

    showModal(){
        this.setState({
            visible: true,
        });
    }

    componentWillReceiveProps(nextProps){
        const {expression} = nextProps;
        let reg_minute = /^[0-9][0-9,]*$/;
        let reg_hour = /^[0-9][0-9,]*$/;
        if(expression != this.props.expression && expression){
            let expression_array = expression.split(' ');
            if(expression_array[0]!=0 || expression_array[3]!='*' || expression_array[4]!='*'
                || expression_array[5]!='?'){
                this.setState({
                    radioValue:2,
                    defaultCron:expression,
                    defaultMinute:[],
                    defaultHour:[]
                })
            }else if(!reg_minute.test(expression_array[1]) || !reg_hour.test(expression_array[2])){
                this.setState({
                    radioValue:2,
                    defaultCron:expression,
                    defaultMinute:[],
                    defaultHour:[]
                })
            }else{
                let minute = expression_array[1].split(',');
                let hour = expression_array[2].split(',');
                let count_minute = 0,count_hour = 0;
                for(let i=0; i<minute.length; i++){
                    if(minute[i]<0 || minute[i]>60){
                        count_minute++;
                        this.setState({
                            radioValue:2,
                            defaultCron:expression,
                            defaultMinute:[],
                            defaultHour:[]
                        })
                    }
                }
                for(let i=0; i<hour.length; i++){
                    if(hour[i]<0 || hour[i]>60){
                        count_hour++;
                        this.setState({
                            radioValue:2,
                            defaultCron:expression,
                            defaultMinute:[],
                            defaultHour:[]
                        })
                    }
                }
                if(count_minute==0 && count_hour==0){
                    this.setState({
                        radioValue:1,
                        defaultMinute:minute,
                        defaultCron:'',
                        defaultHour:hour
                    })
                }
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

    handleOk(){
        this.setState({
            visible:false
        })
        const {getFieldsValue} = this.props.form;
        let formData = getFieldsValue();
        let final_expression=''
        if(this.state.radioValue == 1){
            let hour,minute;
            if(formData.hour.length==0 || formData.minute.length==0){
                final_expression=''
            }else{
                hour = formData.hour.join();
                minute = formData.minute.join();
                let cronExpression = [];
                cronExpression[0] = '0'; cronExpression[1] = minute; cronExpression[2] = hour;
                cronExpression[3] = '*'; cronExpression[4] = '*'; cronExpression[5] = '?';
                final_expression = cronExpression.join(' ');
            }
        }else if(this.state.radioValue == 2){
            final_expression = formData.expression;
        }
        const {setCron} = this.props;
        if(setCron){
            setCron(final_expression);
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
            hour.push(<Option key={i}>{i}</Option>);
        }
        for (let i = 0; i < 60; i++) {
            minute.push(<Option key={i}>{i}</Option>);
        }
        const radioStyle = {
            display: 'block',
            width:'300px',
            paddingTop:'10px'
        };

        return(
            <div>
                <Button type="ghost" onClick={this.showModal.bind(this)}>编译周期</Button>
                <Modal title="设置编译时间"
                       visible={this.state.visible}
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancle.bind(this)}
                >
                    <Row>
                        <RadioGroup onChange={this.onChange.bind(this)}
                                    value={this.state.radioValue}>
                            <Radio value={1} style={radioStyle} >
                                <span style={{paddingRight:'5px'}}>每天在</span>
                                {getFieldDecorator('hour',{initialValue:this.state.defaultHour})(
                                    <Select
                                        multiple
                                        style={{ width: '50%' }}
                                        placeholder="Please select"
                                        onChange={this.handleChange.bind(this)}
                                    >
                                        {hour}
                                    </Select>
                                )}
                                <span>：</span>
                                {getFieldDecorator('minute',{initialValue:this.state.defaultMinute})(
                                    <Select
                                        multiple
                                        style={{ width: '50%' }}
                                        placeholder="Please select"
                                        onChange={this.handleChange.bind(this)}
                                    >
                                        {minute}
                                    </Select>
                                )}
                                <span style={{paddingLeft:'5px'}}>执行编译</span>
                            </Radio>
                            <Radio value={2} style={radioStyle} >
                                <span>cron表达式：</span>
                                {getFieldDecorator('expression',{initialValue:this.state.defaultCron})(
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