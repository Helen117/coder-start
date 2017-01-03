/**
 * Created by zhaojp on 2016/12/26.
 */

import React, {PropTypes,Component} from 'react';
import { Collapse ,Form,Input, Row,Col ,Select ,DatePicker ,Alert, AutoComplete ,Button  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import RequirementInfo from './requirement';
import * as request from './actions/request-action';
import styles from './index.css';

const createForm = Form.create;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class RequirementConditionList extends Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
    }

    componentWillMount() {
        const {selectedProjectSet, actions, requirementInfo,form,condition,loading} = this.props;
        if(condition){
            form.setFieldsValue(condition);
        }
        if (selectedProjectSet && selectedProjectSet.id.indexOf('g') != -1 && ( !requirementInfo || requirementInfo.setsId != selectedProjectSet.selectedItemId)) {
            if(!loading){
                const queryCondition = {sets_id: selectedProjectSet.selectedItemId}
                this.loadQueryOption(this.currentPage,queryCondition);
                actions.getRequestInfo(this.currentPage, queryCondition);
            }

        }
    }

    componentWillReceiveProps(nextProps) {
        const {actions,selectedProjectSet} = this.props;
        const thisSetId = selectedProjectSet?selectedProjectSet.selectedItemId:'';
        const nextSetId = nextProps.selectedProjectSet?nextProps.selectedProjectSet.selectedItemId:'';
        //点击不同项目集，重新加载数据
        if(thisSetId != nextSetId && nextSetId && nextProps.selectedProjectSet.id.indexOf('_g')!=-1 ){
            this.handleReset();
            const queryCondition = {sets_id: nextSetId};
            this.loadQueryOption(this.currentPage,queryCondition);
            actions.getRequestInfo(this.currentPage, queryCondition);
        }
    }

    loadQueryOption(currentPage, queryCondition){
        const actions = this.props.actions;
        actions.requestQueryCondition(currentPage, queryCondition);
        this.props.actions.getMilestoneByName(queryCondition.sets_id,'');
        actions.getDeveloperInfo(queryCondition.sets_id,'set',30);
        actions.getTesterInfo(queryCondition.sets_id,'set',20);
    }

    handleReset(e) {
        this.props.form.resetFields();
        this.props.actions.requestQueryCondition(this.currentPage, null);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,selectedProjectSet,form} = this.props;
        const condition = form.getFieldsValue();
        condition.sets_id = selectedProjectSet.selectedItemId;
        if(condition.expect_due_date && condition.expect_due_date.length>0){
            condition.expect_due_date_start = condition.expect_due_date[0].valueOf();
            condition.expect_due_date_end = condition.expect_due_date[1].valueOf();
        }
        actions.requestQueryCondition(this.currentPage, condition);
        actions.getRequestInfo(this.currentPage, condition);
    }

    render(){
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const {selectedProjectSet, developerInfo, testerInfo,matchMilestone} = this.props;
        const projectId = selectedProjectSet? selectedProjectSet.id.indexOf('g')!=-1:'';
        const { getFieldDecorator } = this.props.form;
        const developer = developerInfo?developerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const tester = testerInfo?testerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const milestone = matchMilestone?matchMilestone.map(data => <Option key={data.id}>{data.title}</Option>):[];
        if(projectId) {
            return(
                <div style={{marginLeft:'10px'}}>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="查询条件" key="1">
                            <Form horizontal className={styles.ant_search_form}>
                                <Row gutter={16}>
                                    <Col sm={7}>
                                        <FormItem label="里程碑" {...formItemLayout} >
                                            {getFieldDecorator('sets_milestone_id')(
                                                <Select showSearch
                                                        showArrow={false}
                                                        allowClear={true}
                                                        placeholder="请输入里程碑名称"
                                                        optionFilterProp="children"
                                                        notFoundContent="无法找到">
                                                    {milestone}
                                                </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col sm={8}>
                                        <FormItem label="需求名称" {...formItemLayout} >
                                            {getFieldDecorator('title')(
                                                <Input  placeholder="请输入需求名称"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col sm={8}>
                                        <FormItem label="状态" {...formItemLayout}>
                                            {getFieldDecorator('state')(<Select allowClear={true}>
                                                <Option value="open">待确认</Option>
                                                <Option value="test_confirmed_running">测试已确认</Option>
                                                <Option value="develop_running">开发中</Option>
                                                <Option value="test_running">测试中</Option>
                                                <Option value="bug_to_be_confirmed_running">bug待确认</Option>
                                                <Option value="bug_fixing_running">修复bug中</Option>
                                                <Option value="finished">已完成</Option>
                                            </Select>)}
                                        </FormItem>
                                     </Col>
                                    </Row>
                                <Row gutter={16}>
                                    <Col sm={7}>
                                        <FormItem label="开发人员" {...formItemLayout} >
                                            {getFieldDecorator('assignee_develop_id')(
                                                <Select showSearch
                                                        showArrow={false}
                                                        allowClear={true}
                                                        placeholder="请选择开发人员"
                                                        optionFilterProp="children"
                                                        notFoundContent="无法找到">
                                                    {developer}
                                                </Select>)}
                                        </FormItem>
                                        </Col>
                                    <Col sm={8}>
                                        <FormItem label="测试人员" {...formItemLayout} >
                                            {getFieldDecorator('assignee_test_id')(
                                                <Select showSearch
                                                        showArrow={false}
                                                        allowClear={true}
                                                        placeholder="请选择测试人员"
                                                        optionFilterProp="children"
                                                        notFoundContent="无法找到">
                                                    {tester}
                                                </Select>)}
                                        </FormItem>
                                        </Col>
                                    <Col sm={8}>
                                        <FormItem label="计划完成时间" {...formItemLayout}>
                                            {getFieldDecorator('expect_due_date')(<RangePicker size="default"/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} offset={12} style={{textAlign: 'right'}}>
                                        <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
                                        <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                                    </Col>
                                </Row>
                                </Form>
                            </Panel>
                        </Collapse>
                        <RequirementInfo
                            requirementListData={this.props.requirementListData}
                            loading={this.props.loading} />

                </div>
            )}else{
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

function mapStateToProps(state) {
    return {
        requirementInfo: state.request.requirementInfo,
        loginInfo:state.login.profile,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        developerInfo: state.request.developer,
        testerInfo: state.request.tester,
        matchMilestone: state.request.matchMilestone,
        page: state.request.page,
        condition: state.request.queryCondition,
        loading: state.request.loading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(request,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(RequirementConditionList));