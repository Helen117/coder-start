/**
 * Created by helen on 2016/12/30.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import { Form,Select,Alert,Table} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as reportActions from './report-action';
import Box from '../../components/box';
import * as request from '../request/actions/request-action';

const FormItem = Form.Item;
const Option = Select.Option;
let lastSelectedProjectSet = "";

class manageViewDemandRank extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount(){
        // const { actions } = this.props;
        // actions.fetchReportData();
        const {form,selectedMilestoneId} = this.props;
        if(selectedMilestoneId){
            form.setFieldsValue({milestone:selectedMilestoneId});
        }
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

    getOption() {
        const option = {
            title: {
                text: '缺陷数'
            },
            tooltip : {
                trigger: 'axis'
            },
            toolbox: {
                orient:"vertical",
                y:'center',
                itemGap:15,
                x:'right',
                show : true,
                feature : {
                    saveAsImage: {},
                    dataView : {show: true, readOnly: false}
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    // data :this.props.reportData?this.props.reportData.map(data => data.name):['孙磊','毕佩珊','赵婧萍','张亚军','刘仁权','钟天生','徐卫忠']
                    data :['工单1','工单2','工单3','工单4','工单4','工单6','工单7']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'缺陷数',
                    symbolSize:10,
                    type:'line',
                    itemStyle: {normal: {color:'#0098d9'}},
                    data:[7,6,5,4,3,2,1]
                }
            ]
        };
        return option;
    }

    fetchData(value){
        const { actions } = this.props;
        if(value){
            actions.fetchDemandStatistics(value);
        }
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

        const pagination = {
            pageSize:20,
            // total: data.length,
        };

        if(projectId) {
        return(
            <Box title="一个里程碑中的工单统计情况">
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
                <Table columns={this.columns(this)} dataSource={this.props.reportData}
                       bordered
                       size="middle"
                       pagination={pagination}
                       loading={this.props.loading}
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

manageViewDemandRank.prototype.columns = (self)=>[{
    title: '工单',
    dataIndex: 'title',
},{
    title: '缺陷数',
    dataIndex: 'defect_num',
    sorter: (a, b) => a.defect_num - b.defect_num,
}, {
    title: '涉及系统数量',
    dataIndex: 'systm_num',
    sorter: (a, b) => a.systm_num - b.systm_num,
}];

manageViewDemandRank = Form.create()(manageViewDemandRank);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        reportData:state.report.demandStatistics,
        loading:state.report.getDemandStatisticsPending,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        matchMilestone: state.request.matchMilestone,
        selectedMilestoneId:state.report.selectedMilestoneId_worksheet,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
        request : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(manageViewDemandRank);