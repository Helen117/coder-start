/**
 * Created by helen on 15016/9/19.
 */
import React, {PropTypes,Component} from 'react';
import { Table ,Button,Input,notification,Form,Select,DatePicker,Col,Row ,Icon } from 'antd';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';
import * as getAllUser from '../register/actions/register-action'
import IssueList from '../../components/issues-list';
import styles from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class ProjectIssueList extends Component {

    constructor(props) {
        super(props);
        this.state ={formSearch:{'display':''}};
    }

    componentWillMount() {
        const {actions,projectInfo,getUserAction} = this.props;
        if(projectInfo) {
            actions.fetchDataSource(projectInfo.id);
            getUserAction.getAllUser();
            actions.getIssueList(projectInfo.id);
        }else{
            const {router} = this.context;
            router.goBack();
            this.errChosePro();
        }
    }

    componentDidMount() {

    }
    // shouldComponentUpdate(nextProps, nextState){
    //     return true;
    // }

    errChosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在“代码管理“中选择一个项目！',
            duration: 2
        });
    }

    componentWillReceiveProps(nextProps) {
        const {actions,projectInfo} = this.props;

        if(projectInfo && projectInfo.id != nextProps.projectInfo.id) {
            actions.getIssueList(nextProps.projectInfo.id);
            actions.fetchDataSource(nextProps.projectInfo.id);
        }
    }

    handleReset(e) {
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,projectInfo,form} = this.props;
        const data = form.getFieldsValue();
        console.log('查询条件：',data);
    }

    onToggle(){
        if(!this.state.formSearch.display){
            this.setState({formSearch:{'display':'none'}});
        }else{
            this.setState({formSearch:{'display':''}});
        }
    }


    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const assignee =this.props.members?this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const mileStoneOptions =this.props.milestones?this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        const userInfo = this.props.user?this.props.user.map(data => <Option key={data.username}>{data.name}</Option>):[];

        return (
            <div><Icon type="shrink" onClick={this.onToggle.bind(this)} style={{float:'right',fontSize:18, margin:5}}/>
                <Box title="查询条件">
                <Form horizontal style={this.state.formSearch} className={styles.ant_search_form} >
                    <Row gutter={16}>
                        <Col sm={8}>
                            <FormItem label="里程碑" {...formItemLayout} >
                                <Select showSearch
                                        showArrow={false}
                                        placeholder="请选择里程碑"
                                        optionFilterProp="children"
                                        notFoundContent="无法找到"
                                        {...getFieldProps('milestone')}>
                                    {mileStoneOptions}
                                </Select>
                            </FormItem>
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
                            <FormItem label="状态" {...formItemLayout}>
                                <Select {...getFieldProps('state')}>
                                    <Option value="opened">打开</Option>
                                    <Option value="closed">关闭</Option>
                                    <Option value="reopened" >重开</Option>
                                </Select>
                            </FormItem>
                        </Col>
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
                            <FormItem label="创建时间" {...formItemLayout}>
                                <RangePicker size="default" {...getFieldProps('created_at')}/>
                            </FormItem>
                            <FormItem label="计划完成时间" {...formItemLayout}>
                                <RangePicker size="default" {...getFieldProps('due_date')}/>
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
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
                            <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                        </Col>
                    </Row>
                </Form>
                </Box>

                <IssueList  dataSource={this.props.issueList}
                            loading={this.props.loading}
                            loginInfo={this.props.loginInfo}
                >
                </IssueList>
            </div>

        )

    }

}

ProjectIssueList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectIssueList = Form.create()(ProjectIssueList);

function mapStateToProps(state) {
    return {
        milestones:state.GetIssueDependent.milestones,
        labels:state.GetIssueDependent.labels,
        members : state.GetIssueDependent.members,
        issueList: state.issue.issueList,
        loading:state.issue.loading,
        projectInfo:state.getProjectInfo.projectInfo,
        groupInfo:state.getGroupInfo.groupInfo,
        loginInfo:state.login.profile,
        user:state.register.users,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(issue, dispatch),
        getUserAction : bindActionCreators(getAllUser, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectIssueList);