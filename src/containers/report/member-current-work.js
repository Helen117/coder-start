/**
 * Created by helen on 2017/1/12.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Form,Select,Alert} from 'antd';
import * as reportActions from './report-action';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;

class MemberCurrentWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
        const {actions,form,condition} = this.props;
        actions.fetchGroupsInfo();
        if(condition){
            form.setFieldsValue({group:condition});
        }
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {

    }

    fetchData(value){
        const { actions } = this.props;
        if(value){
            actions.fetchMemberCurrentWork(value);
        }
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
                    data :this.props.reportData?this.props.reportData.map(data => data.name):[]
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
            labelCol: { span: 10 },
            wrapperCol: { span: 12 },
        };

        const {groups} = this.props;
        const groupsInfo = groups&&groups.length>0?groups.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return(
                <Box title="团队成员当前工作情况">
                    <Form horizontal  >
                        <FormItem label="团队名称" {...formItemLayout}>
                            {getFieldDecorator('group',{rules:[{ required:true,message:'不能为空'}]})(
                                <Select showSearch
                                        showArrow={false}
                                        placeholder="请选择一个团队"
                                        optionFilterProp="children"
                                        notFoundContent="无法找到"
                                        onSelect={this.fetchData.bind(this)}
                                        style={{width: '200px'}}>
                                    {groupsInfo}
                                </Select>)
                            }
                        </FormItem>
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

MemberCurrentWork = Form.create()(MemberCurrentWork);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        reportData:state.report.memberCurrentWork,
        loginInfo:state.login.profile,
        groups:state.report.groups,
        condition:state.report.condition_membercurrent,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MemberCurrentWork);