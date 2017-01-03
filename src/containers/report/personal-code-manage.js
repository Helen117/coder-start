/**
 * Created by helen on 2017/1/3.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Form,Select,Alert,Row,Col,Button} from 'antd';
import * as reportActions from './report-action';
import * as request from '../request/actions/request-action';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;

class PersonalCodeManageReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){

    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {
        const {request,selectedProjectSet} = this.props;
        const thisSetId = selectedProjectSet?selectedProjectSet.selectedItemId:'';
        const nextSetId = nextProps.selectedProjectSet?nextProps.selectedProjectSet.selectedItemId:'';
        //点击不同项目集，重新加载数据
        if(thisSetId != nextSetId && nextSetId && nextProps.selectedProjectSet.id.indexOf('_g')!=-1 ){
            request.getMilestoneByName(nextProps.selectedProjectSet.selectedItemId,'');
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
                data:['提交代码行数','bug数量','合并失败次数','代码走查拒绝次数'],
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: false},
                    saveAsImage: {}
                }
            },
            grid: {
                left: '8%',
                right: '18%',
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
                {name:'提交代码行数',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#0098d9'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.total):[]
                },
                {
                    name:'bug数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#c12e34'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.expired):[]
                },
                {
                    name:'合并失败次数',
                    barCategoryGap  : 10,
                    type:'bar',
                    itemStyle: {normal: {color:'#B2B6B7'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.defect_total):[]
                },
                {
                    name:'代码走查拒绝次数',
                    symbolSize:10,
                    type:'bar',
                    itemStyle: {normal: {color:'#F5F629'}},
                    data:this.props.reportData?this.props.reportData.map(data => data.defect_expired):[]
                }
            ]
        };
        return option;
    }


    fetchMember(value){
        const { actions } = this.props;
        if(value){
            actions.fetchMemberInfo(value);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,form,loginInfo} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {

            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const {selectedProjectSet,matchMilestone,matchMember} = this.props;
        const projectId = selectedProjectSet? selectedProjectSet.id:'';

        const milestone = matchMilestone?matchMilestone.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const member = matchMember?matchMember.map(data => <Option key={data.userId}>{data.name}</Option>):[];

        if(projectId) {
            return(
                <Box title="从个人视角查看个人某里程碑中的代码提交整体情况">
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
                                                onSelect={this.fetchMember.bind(this)}
                                                style={{width: '200px'}}>
                                            {milestone}
                                        </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col sm={8}>
                                <FormItem label="人员" {...formItemLayout}>
                                    {getFieldDecorator('user',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select showSearch
                                                showArrow={false}
                                                placeholder="请选择一个成员"
                                                optionFilterProp="children"
                                                notFoundContent="无法找到"
                                                style={{width: '200px'}}>
                                            {member}
                                        </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col sm={8}>
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

PersonalCodeManageReport = Form.create()(PersonalCodeManageReport);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        reportData:state.report.reportData,
        loading:state.report.getReportDataPending,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        matchMilestone: state.request.matchMilestone,
        matchMember: state.report.member,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
        request : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PersonalCodeManageReport);