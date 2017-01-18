/**
 * Created by helen on 2017/1/12.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import { Form,Select,Alert,Col,Row,Button} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as reportActions from './report-action';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;
class TeamCurrentWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
        const {actions,form,condition} = this.props;
        actions.fetchGroupsInfo();
        if(condition){
            form.setFieldsValue(condition);
        }
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {

    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                actions.fetchTeamCurrentWork(data.group,data);
            }
        })
    }


    getOption() {
        const option = {
            // title: {
            //     text: ''
            // },
            tooltip : {
                trigger: 'axis'
            },
            legend:{
                orient:"vertical",
                y:"center",
                right:'right',
                data:['今日待办','共有待办','超时未完成','超时已完成'],
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: false},
                    saveAsImage: {}
                }
            },
            grid: {
                left: '10%',
                right: '15%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data :this.props.reportData?this.props.reportData.map(data => data.group_name):[]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {name:'今日待办',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#0098d9'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.today_no_complete):[]
                },
                {
                    name:'共有待办',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#c12e34'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.no_complete):[]
                },
                {
                    name:'超时未完成',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#F5F629'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.expired_no_complete):[]
                },
                {
                    name:'超时已完成',
                    symbolSize:10,
                    type:'bar',
                    itemStyle: {normal: {color:'#B2B6B7'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.expired_complete):[]
                }
            ]
        };
        return option;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 14 },
            wrapperCol: { span: 8 },
        };
        const {groups} = this.props;
        const groupsInfo = groups&&groups.length>0?groups.map(data => <Option key={data.id}>{data.name}</Option>):[];
        return(
            <Box title="多个团队当前工作情况比较">
                <Form horizontal  >
                    <Row gutter={16}>
                        <Col sm={12}>
                            <FormItem label="团队名称" {...formItemLayout}>
                                {getFieldDecorator('group',{rules:[{ required:true,type:'array',message:'不能为空'}]})(
                                    <Select multiple
                                            placeholder="请选择团队"
                                            style={{width: '200px'}}>
                                        {groupsInfo}
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col sm={12}>
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
                        </Col>
                    </Row>
                </Form>
                <ReactEcharts
                    option={this.getOption()}
                    style={{height: '350px', width: '100%'}}
                    theme="my_theme"
                />
            </Box>
        );
    }
}

TeamCurrentWork = Form.create()(TeamCurrentWork);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        reportData:state.report.teamCurrentWork,
        groups:state.report.groups,
        condition:state.report.condition_teamcurrent,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TeamCurrentWork);