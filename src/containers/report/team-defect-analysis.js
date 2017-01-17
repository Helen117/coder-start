/**
 * Created by helen on 2016/12/29.
 */
import React, {PropTypes,Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Row,Col,Form,Select,Button,Alert} from 'antd';
import * as reportActions from './report-action';
import Box from '../../components/box';
import Pie from '../../components/echarts-report/pie';
import * as request from '../request/actions/request-action';

const FormItem = Form.Item;
const Option = Select.Option;

class TeamMemberDemandProportion extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
        const {actions} = this.props;
        actions.fetchGroupsInfo();
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

    handleSubmit(e) {
        e.preventDefault();
        const {actions,form} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                actions.fetchTeamMemberDemandProportion(data.milestone,data.group);
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const {selectedProjectSet,matchMilestone,groups} = this.props;
        const projectId = selectedProjectSet? selectedProjectSet.id:'';

        const milestone = matchMilestone&&matchMilestone.length>0?matchMilestone.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const groupsInfo = groups&&groups.length>0?groups.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const member = this.props.memberRate?this.props.memberRate.map(data => data.username):[];
        const demand = this.props.memberRate?this.props.memberRate.map(data =>{
            return {value:data.total,
                name:data.username}
        }):[];
        const defect = this.props.memberRate?this.props.memberRate.map(data =>{return{value:data.defect_total,name:data.username}}):[];
        const expired = this.props.memberRate?this.props.memberRate.map(data =>{return{value:data.expired,name:data.username}}): [];
        if(projectId) {
        return(
            <Box title="从团队leader视角展示当前团队成员的需求、超时工单和缺陷的占比情况分析">

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
                                {getFieldDecorator('group',{rules:[{ required:true,message:'不能为空'}]})(
                                    <Select showSearch
                                            showArrow={false}
                                            placeholder="请选择一个团队"
                                            optionFilterProp="children"
                                            notFoundContent="无法找到"
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

                <Row>
                    <Col span={12}>
                        <Pie title="需求数量" legend={member} name="需求数量" data={demand}/>
                    </Col>
                    <Col span={12} style={{textAlign:'right'}}>
                        <Pie title="缺陷数量" legend={member} name="缺陷数量" data={defect}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        </Col>
                    <Col span={12}>
                    <Pie title="超时数量" legend={member} name="超时数量" data={expired}  style={{height: '350px', width: '60%'}}
                    />
                        </Col>
                </Row>
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


TeamMemberDemandProportion = Form.create()(TeamMemberDemandProportion);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        memberRate:state.report.memberRate,
        loading:state.report.getMemberRatePending,
        matchMilestone: state.request.matchMilestone,
        matchMember: state.report.member,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        groups:state.report.groups,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
        request : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TeamMemberDemandProportion);