/**
 * Created by helen on 2016/12/29.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Form,Select,Alert} from 'antd';
import * as reportActions from './report-action';
import * as request from '../request/actions/request-action';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;
let lastSelectedProjectSet = "";

class BusinessDemandStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount(){
        const {form,selectedMilestoneId,selectedProjectSet} = this.props;
        if(selectedProjectSet && selectedProjectSet.id.indexOf('_g')!=-1 && selectedProjectSet.id!=lastSelectedProjectSet){
            lastSelectedProjectSet = selectedProjectSet.id;
            form.resetFields();
        }else if(selectedMilestoneId && selectedProjectSet.id.indexOf('_g')!=-1){
            form.setFieldsValue({milestone:selectedMilestoneId});
        }
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {
        const {request,selectedProjectSet,form,actions} = this.props;
        const thisSetId = selectedProjectSet?selectedProjectSet.selectedItemId:'';
        const nextSetId = nextProps.selectedProjectSet?nextProps.selectedProjectSet.selectedItemId:'';
        //点击不同项目集，重新加载数据
        if(thisSetId != nextSetId && nextSetId && nextProps.selectedProjectSet.id.indexOf('_g')!=-1 ){
            if(lastSelectedProjectSet != nextProps.selectedProjectSet.id){
                request.getMilestoneByName(nextProps.selectedProjectSet.selectedItemId,'');
                form.resetFields();
                actions.resetReportData([]);
                lastSelectedProjectSet = nextProps.selectedProjectSet.id;
            }else{
                form.setFieldsValue({milestone:nextProps.selectedMilestoneId});
            }
        }
    }

    fetchData(value){
        const { actions } = this.props;
        if(value){
            actions.fetchReportData(value);
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
                data:['需求数量','超时数量','缺陷数量','缺陷超时数量'],
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
                    data :this.props.reportData?this.props.reportData.map(data => data.label):[]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {name:'需求数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#0098d9'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.total):[]
                },
                {
                    name:'超时数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#c12e34'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.expired):[]
                },
                {
                    name:'缺陷数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#B2B6B7'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.defect_total):[]
                },
                {
                    name:'缺陷超时数量',
                    symbolSize:10,
                    type:'bar',
                    itemStyle: {normal: {color:'#F5F629'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.defect_expired):[]
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
        const {selectedProjectSet,matchMilestone} = this.props;
        const projectId = selectedProjectSet? (selectedProjectSet.id.indexOf('_g')!=-1?selectedProjectSet.id:''):'';
        const milestone = matchMilestone?matchMilestone.map(data => <Option key={data.id}>{data.title}</Option>):[];
        if(projectId) {
            return(
                <Box title="从业务范畴视角查看一个里程碑中的需求执行情况">
                    <Form horizontal  >
                        <FormItem label="里程碑" {...formItemLayout}>
                            {getFieldDecorator('milestone')(
                                <Select showSearch
                                        showArrow={false}
                                        placeholder="请选择一个里程碑"
                                        optionFilterProp="children"
                                        notFoundContent="无法找到"
                                        onSelect={this.fetchData.bind(this)}
                                        style={{width: '200px'}}>
                                    {milestone}
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
        }else{
            return (
                <Alert style={{margin:10}}
                       message="请从左边的项目树中选择一个具体的项目集！"
                       description=""
                       type="warning"
                       showIcon
                />
            )
        }
    }
}

BusinessDemandStatistics = Form.create()(BusinessDemandStatistics);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        reportData:state.report.reportData,
        loading:state.report.getReportDataPending,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        matchMilestone: state.request.matchMilestone,
        selectedMilestoneId:state.report.selectedMilestoneId_require,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
        request : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BusinessDemandStatistics);