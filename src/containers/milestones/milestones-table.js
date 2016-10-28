/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import IssuesList from '../../components/issues-list';
import { Button,Form,Select,DatePicker,Col,Row,Collapse  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestonesIssues} from './actions/milestones-action';
import * as getAllUser from '../register/actions/register-action';
import {fetchDataSource} from '../issues/actions/issue-action';
import  './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;

class MilestoneDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {getUserAction} = this.props;
        getUserAction.getAllUser();
    }

    componentDidMount() {
        const {milestonesId} = this.props.location.state;
        const {projectId} = this.props.location.state;
        if (milestonesId && projectId){
            this.props.getMilestonesDetail(milestonesId,projectId);
            this.props.fetchDataSource(projectId);
        }
    }

    handleReset() {
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,projectInfo,form} = this.props;
        const data = form.getFieldsValue();
        console.log('查询条件：',data);
    }

    render(){
        const milestoneDetail = this.props.milestoneDetail;
        const isLoading = this.props.loading;
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const assignee =this.props.members?this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        const userInfo = this.props.user?this.props.user.map(data => <Option key={data.username}>{data.name}</Option>):[];

        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="查询条件" key="1">
                        <Form horizontal className="ant_search_form" >
                            <Row gutter={16}>
                                <Col sm={8}>
                                    <FormItem label="问题标签" {...formItemLayout}>
                                        <Select showSearch
                                                showArrow={false}
                                                placeholder="请选择标签"
                                                optionFilterProp="children"
                                                notFoundContent="无法找到"
                                                {...getFieldProps('label')}>
                                            {label}
                                        </Select>
                                    </FormItem>
                                    <FormItem label="状态" {...formItemLayout}>
                                        <Select {...getFieldProps('state')}>
                                            <Option value="opened">打开</Option>
                                            <Option value="closed">关闭</Option>
                                            <Option value="reopened" >重开</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col sm={8}>
                                    <FormItem label="创建人"{...formItemLayout}>
                                        <Select showSearch
                                                showArrow={false}
                                                placeholder="请选择人员"
                                                optionFilterProp="children"
                                                notFoundContent="无法找到"
                                                {...getFieldProps('author_name')}>
                                            {userInfo}
                                        </Select>
                                    </FormItem>
                                    <FormItem label="创建时间" {...formItemLayout}>
                                        <RangePicker size="default" {...getFieldProps('created_at')}/>
                                    </FormItem>
                                </Col>
                                <Col sm={8}>
                                    <FormItem label="修复人" {...formItemLayout} >
                                        <Select showSearch
                                                showArrow={false}
                                                placeholder="请选择人员"
                                                optionFilterProp="children"
                                                notFoundContent="无法找到"
                                                {...getFieldProps('assignee')}>
                                            {assignee}
                                        </Select>
                                    </FormItem>
                                    <FormItem label="计划完成时间" {...formItemLayout}>
                                        <RangePicker size="default" {...getFieldProps('due_date')}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
                                    <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Panel>
                </Collapse>
                <IssuesList loading = {isLoading} dataSource={milestoneDetail} loginInfo={this.props.loginInfo}>
                </IssuesList>
            </div>
        )
    }
}


MilestoneDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

MilestoneDetail = Form.create()(MilestoneDetail);

function mapStateToProps(state) {
    return {
        milestoneDetail: state.getMilestonesIssues.milestoneIssues,
        loading:state.getMilestonesIssues.loading,
        loginInfo:state.login.profile,
        user:state.register.users,
        labels:state.GetIssueDependent.labels,
        members : state.GetIssueDependent.members,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesDetail: bindActionCreators(getMilestonesIssues, dispatch),
        getUserAction : bindActionCreators(getAllUser, dispatch),
        fetchDataSource: bindActionCreators(fetchDataSource, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneDetail);