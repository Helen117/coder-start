/**
 * Created by helen on 2017/1/3.
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

class PersonalCodeManageReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
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
                data:['新增代码行数','删除代码行数','bug数量','合并失败次数','代码走查拒绝次数','修改函数数量','新增类数量','修改类数量','删除类数量'],
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
                    data :this.props.reportData?this.props.reportData.map(data => data.project_name):[]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {name:'新增代码行数',
                    barCategoryGap  : 10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.add_line_num):[]
                },
                {name:'删除代码行数',
                    barCategoryGap  : 10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.del_line_num):[]
                },
                {
                    name:'bug数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.bug_num):[]
                },
                {
                    name:'合并失败次数',
                    barCategoryGap  : 10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.failure_num):[]
                },
                {
                    name:'代码走查拒绝次数',
                    symbolSize:10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.refuse_num):[]
                },{name:'修改函数数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.funtion_num):[]
                },
                {
                    name:'新增类数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.add_class_num):[]
                },
                {
                    name:'修改类数量',
                    barCategoryGap  : 10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.modify_class_num):[]
                },
                {
                    name:'删除类数量',
                    symbolSize:10,
                    type:'bar',
                    data:this.props.reportData?this.props.reportData.map(data => data.delete_class_num):[]
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
        const {actions,form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                actions.fetchPersonalCodeManage(data.milestone,data.user,data);
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
        const projectId = selectedProjectSet? (selectedProjectSet.id.indexOf('_g')!=-1?selectedProjectSet.id:''):'';
        const milestone = matchMilestone?matchMilestone.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const member = matchMember?matchMember.map(data => <Option key={data.userId}>{data.name}</Option>):[];
        const loading = this.props.loading?this.props.loading:false;
        console.log("projectId:",projectId)

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
                    <Spin spinning={loading} tip="正在加载数据...">
                        {(this.props.reportData && this.props.reportData.length>0)?<ReactEcharts
                            option={this.getOption()}
                            style={{height: '350px', width: '100%'}}
                            theme="my_theme"
                        />:<DisplayOfNone/>}
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

PersonalCodeManageReport = Form.create()(PersonalCodeManageReport);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        reportData:state.report.personalCodeManage,
        loading:state.report.getPersonalCodeManagePending,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        matchMilestone: state.request.matchMilestone,
        matchMember: state.report.member,
        condition:state.report.condition_personal,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
        request : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PersonalCodeManageReport);