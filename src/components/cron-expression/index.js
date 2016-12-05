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
            isPercentHour:true
        }
    }

    showModal(){
        this.setState({
            visible: true,
        });
    }

    componentWillReceiveProps(nextProps){
        const {expression} = nextProps;
        if(expression != this.props.expression && expression){
            this.splitCronExpression(expression);
        }
    }

    splitCronExpression(expression){
        const {setFieldsValue} = this.props.form;
        let reg_minute = /^([0-5]?\d)(,([0-5]?\d))*$/;
        let reg_hour = /^(2[0-3]|[0-1]?\d)(,(2[0-3]|[0-1]?\d))*$/;
        let reg_perhour = /^\*\/(2[0-3]|[0-1]?\d)$/;
        let reg_perminute = /^\*\/([0-5]?\d)$/;
        let expression_array = expression.split(' ');
        if(expression_array[2]!='*' || expression_array[3]!='*'
            || expression_array[4]!='*'){
            this.setState({
                radioValue:3,
            })
            setFieldsValue({
                expression:expression,
                minute:[],
                hour:[]
            });
        }else if(!reg_minute.test(expression_array[0]) || !reg_hour.test(expression_array[1])){
            if(reg_perminute.test(expression_array[0]) && expression_array[1]=='*'){
                this.setState({
                    radioValue:2,
                })
                let index = expression_array[0].indexOf('/');
                let per_minute = expression_array[0].substr(index+1,expression_array[0].length);
                console.log('per_minute:',per_minute)
                setFieldsValue({
                    expression:'',
                    minute:[],
                    hour:[],
                    percent:per_minute,
                    grading:'perminute'
                });
            }else if(reg_perhour.test(expression_array[1]) && expression_array[0]=='*'){
                this.setState({
                    radioValue:2,
                })
                let index = expression_array[1].indexOf('/');
                let per_hour = expression_array[1].substr(index+1,expression_array[1].length);
                console.log('per_hour:',per_hour)
                setFieldsValue({
                    expression:'',
                    minute:[],
                    hour:[],
                    percent:per_hour,
                    grading:'perhour'
                });
            }else {
                this.setState({
                    radioValue:3,
                })
                setFieldsValue({
                    expression:expression,
                    minute:[],
                    hour:[]
                });
            }
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
            radioValue:3
        })
    }

    formatCronexpression(cron){
        if (!cron){
            return '';
        }
        let reg_minute = /^([0-5]?\d)(,([0-5]?\d))*$/;
        let reg_hour = /^(2[0-3]|[0-1]?\d)(,(2[0-3]|[0-1]?\d))*$/;
        let reg_perhour = /^\*\/(2[0-3]|[0-1]?\d)$/;
        let reg_perminute = /^\*\/([0-5]?\d)$/;
        let cron_array = cron.split(' ');
        if(cron_array.length!=5){
            return cron
        }
        if(cron_array[2]!='*' || cron_array[3]!='*'
            || cron_array[4]!='*'){
            return cron
        }
        if(!reg_minute.test(cron_array[0]) || !reg_hour.test(cron_array[1])){
            if((reg_perminute.test(cron_array[0]) && cron_array[1]=='*')
                || (reg_perhour.test(cron_array[1]) && cron_array[0]=='*')){
                let expression_desc = this.cronToDesc(null,null);
                return expression_desc;
            }else {
                return cron;
            }
        }else{
            let hour_temp = cron_array[1];
            let minute_temp = cron_array[0];
            let hour = hour_temp.split(',');
            let minute = minute_temp.split(',');
            let expression_desc = this.cronToDesc(hour,minute);
            return expression_desc;
        }

    }

    handleOk(){
        this.setState({
            visible:false
        })
        const {getFieldsValue} = this.props.form;
        const {setCron} = this.props;
        let formData = getFieldsValue();
        let final_expression='',expression_desc='';
        let cronExpression = [];
        cronExpression[2] = '*'; cronExpression[3] = '*'; cronExpression[4] = '*';
        if(this.state.radioValue == 1){
            let hour,minute;
            if(formData.hour.length==0 || formData.minute.length==0){
                final_expression=''
            }else{
                expression_desc = this.cronToDesc(formData.hour,formData.minute);
                hour = formData.hour.join();
                minute = formData.minute.join();
                cronExpression[0] = minute; cronExpression[1] = hour;
                final_expression = cronExpression.join(' ');
            }
        }else if(this.state.radioValue == 3){
            final_expression = formData.expression;
            expression_desc = formData.expression;
        }else if(this.state.radioValue == 2){
            if(formData.grading == 'perhour'){
                cronExpression[0] = '*'; cronExpression[1] = '*/'+formData.percent;
                final_expression = cronExpression.join(' ');
                expression_desc = this.cronToDesc(null,null);
            }else if(formData.grading == 'perminute'){
                cronExpression[0] = '*/'+formData.percent; cronExpression[1] = '*';
                final_expression = cronExpression.join(' ');
                expression_desc = this.cronToDesc(null,null);
            }
        }
        if(setCron){
            setCron(final_expression,expression_desc);
        }
    }

    cronToDesc(hour,minute){
        let expression_desc='';
        if(this.state.radioValue == 1){
            let expression_desc_temp = [];
            for(let i=0; i<hour.length; i++){
                for(let j=0; j<minute.length; j++){
                    expression_desc_temp.push(hour[i]+'点'+minute[j]+'分')
                }
            }
            expression_desc = expression_desc_temp.join(' ');
            expression_desc = '每天： '+expression_desc+' 执行';
        }else if(this.state.radioValue == 2){
            const {getFieldsValue} = this.props.form;
            let formData = getFieldsValue();
            if(formData.grading == 'perhour'){
                expression_desc = '每隔： '+formData.percent+' 小时执行';
            }else if(formData.grading == 'perminute'){
                expression_desc = '每隔： '+formData.percent+' 分钟执行';
            }
        }
        return expression_desc;
    }

    handleCancle(){
        this.setState({
            visible:false
        })
    }

    percentChange(value){
        this.setState({
            radioValue:2
        })
    }

    gradingChange(value){
        this.setState({
            radioValue:2
        })
        if(value == 'perhour'){
            this.setState({
                isPercentHour:true
            })
        }else if(value == 'perminute'){
            this.setState({
                isPercentHour:false
            })
        }
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
        let percentHour = [],percentMinute = [];
        for (let i = 0; i < 24; i++) {
            percentHour.push(<Option key={i}>{i}</Option>);
        }
        for (let i = 0; i < 60; i++) {
            percentMinute.push(<Option key={i}>{i}</Option>);
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
                                <span style={{paddingRight:'5px'}}>每隔</span>
                                {getFieldDecorator('percent')(
                                    <Select
                                        showSearch
                                        style={{ width: '50%' }}
                                        placeholder="Select a person"
                                        optionFilterProp="children"
                                        onChange={this.percentChange.bind(this)}
                                    >
                                        {this.state.isPercentHour?percentHour:percentMinute}
                                    </Select>
                                )}
                                {getFieldDecorator('grading',{initialValue:'perhour'})(
                                    <Select style={{ width: '50%' }}
                                            onChange={this.gradingChange.bind(this)}>
                                        <Option value="perhour">小时</Option>
                                        <Option value="perminute">分钟</Option>
                                    </Select>
                                )}
                                <span style={{paddingLeft:'5px'}}>执行</span>
                            </Radio>
                            <Radio value={3} style={radioStyle} >
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


export default CronExpression = Form.create({withRef:true})(CronExpression);