/**
 * Created by helen on 2017/1/10.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Form,Select,Alert,Row,Col,Button,Spin} from 'antd';
import * as reportActions from './report-action';
import * as request from '../request/actions/request-action';
import Box from '../../components/box';
import DisplayOfNone from '../../components/display-of-none';

const FormItem = Form.Item;
const Option = Select.Option;
let lastSelectedProjectSet = "";

class TeamStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
        const {actions} = this.props;
        actions.fetchGroupsInfo();
        const {form,condition,selectedProjectSet} = this.props;
        if(selectedProjectSet && selectedProjectSet.id.indexOf('_g')!=-1 && selectedProjectSet.id!=lastSelectedProjectSet){
            lastSelectedProjectSet = selectedProjectSet.id;
            form.resetFields();
        }else if(condition && selectedProjectSet.id.indexOf('_g')!=-1){
            form.setFieldsValue(condition);
        }
    }

    componentDidMount(){

    }

    componentWillUpdate(){
        if (!this.props.reportData&&this.refs.echarts){
            this.refs.echarts.getEchartsInstance().clear();
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
                form.setFieldsValue(nextProps.condition);
            }
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
                data:['团队人数','人均需求分配','人均需求超时','人均缺陷情况'],
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
                    data :this.props.reportData?this.props.reportData.map(data => data.teamname):[]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {name:'团队人数',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#0098d9'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.team_num):[]
                },
                {
                    name:'人均需求分配',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#c12e34'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.average_demand):[]
                },
                {
                    name:'人均需求超时',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#B2B6B7'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.average_expired):[]
                },
                {
                name:'人均缺陷情况',
                barCategoryGap  : 10,
                type:'bar',
                itemStyle: {normal: {color:'#F5F629'}},
                data:this.props.reportData?this.props.reportData.map(data => data.average_defect):[]
                }
            ]
        };
        return option;
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                actions.fetchTeamStatistics(data.milestone,data.group,data);
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const {selectedProjectSet,matchMilestone,groups} = this.props;
        const projectId = selectedProjectSet? (selectedProjectSet.id.indexOf('_g')!=-1?selectedProjectSet.id:''):'';
        const milestone = matchMilestone?matchMilestone.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const groupsInfo = groups&&groups.length>0?groups.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const loading = this.props.loading?this.props.loading:false;

        if(projectId) {
            return(
                <Box title="横向对多个团队的情况进行对比分析">
                    <Form horizontal  >
                        <Row gutter={16}>
                            <Col sm={8}>
                                <FormItem label="里程碑" {...formItemLayout}>
                                    {getFieldDecorator('milestone',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select showSearch
                                                showArrow={false}
                                                placeholder="请选择一个里程碑"
                                                optionFilterProp="children"
                                                notFoundContent="无法找到"
                                                style={{width: '200px'}}>
                                            {milestone}
                                        </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col sm={8}>
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
                            <Col sm={8}>
                                <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Spin spinning={loading} tip="正在加载数据...">
                        {(this.props.reportData && this.props.reportData.length>0)?<ReactEcharts
                            ref="echarts"
                            option={this.getOption()}
                            style={{height: '350px', width: '100%'}}
                            theme="my_theme"
                        />:(loading?'':<DisplayOfNone/>)}
                    </Spin>
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

TeamStatistics = Form.create()(TeamStatistics);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        reportData:state.report.teamStatistics,
        loading:state.report.getTeamStatisticsPending,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        matchMilestone: state.request.matchMilestone,
        loginInfo:state.login.profile,
        groups:state.report.groups,
        condition:state.report.condition_teamStatistics,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
        request : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TeamStatistics);