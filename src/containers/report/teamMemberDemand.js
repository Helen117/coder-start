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
import {getUserRelationTree} from '../user-relation/actions/user-relation-actions';
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
        const {loginInfo} = this.props;
        this.props.getUserRelationTree(loginInfo.userId);
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
        const {selectedProjectSet,matchMilestone,team} = this.props;
        const projectId = selectedProjectSet? selectedProjectSet.id:'';

        const milestone = matchMilestone?matchMilestone.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const groups = team&&team.userTreeData?team.userTreeData.map(data => <Option key={data.id}>{data.name}</Option>):[];

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
                                {getFieldDecorator('user',{rules:[{ required:true,message:'不能为空'}]})(
                                    <Select showSearch
                                            showArrow={false}
                                            placeholder="请选择一个团队"
                                            optionFilterProp="children"
                                            notFoundContent="无法找到"
                                            style={{width: '200px'}}>
                                        {groups}
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
                        <Pie title="需求数量" legend={['成员1','成员2','成员3','成员4','成员5']} name="需求数量" data={[
                        {value:3, name:'成员1'},
                        {value:5, name:'成员2'},
                        {value:6, name:'成员3'},
                        {value:2, name:'成员4'},
                        {value:1, name:'成员5'}
                    ]}/>
                    </Col>
                    <Col span={12} style={{textAlign:'right'}}>
                        <Pie title="缺陷数量" legend={['成员1','成员2','成员3','成员4','成员5']} name="缺陷数量" data={[
                        {value:3, name:'成员1'},
                        {value:5, name:'成员2'},
                        {value:6, name:'成员3'},
                        {value:2, name:'成员4'},
                        {value:1, name:'成员5'}
                    ]}/>
                    </Col>
                </Row>
                <Row>
                    <Pie title="超时数量" legend={['成员1','成员2','成员3','成员4','成员5']} name="超时数量" data={[
                        {value:3, name:'成员1'},
                        {value:5, name:'成员2'},
                        {value:6, name:'成员3'},
                        {value:2, name:'成员4'},
                        {value:1, name:'成员5'}
                    ]}  style={{height: '350px', width: '80%'}}
                    />
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
        reportData:state.report.reportData,
        loading:state.report.getReportDataPending,
        matchMilestone: state.request.matchMilestone,
        matchMember: state.report.member,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        team:state.UserRelation.getUserRelationTree,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(reportActions,dispatch),
        getUserRelationTree:bindActionCreators(getUserRelationTree, dispatch),
        request : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TeamMemberDemandProportion);