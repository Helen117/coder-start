/**
 * Created by helen on 15016/9/19.
 */
import React, {PropTypes,Component} from 'react';
import { Button,notification,Form,Select,DatePicker,Col,Row ,Icon,Collapse } from 'antd';
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
const Panel = Collapse.Panel;

class ProjectIssueList extends Component {

    constructor(props) {
        super(props);
        this.state ={};
    }

    componentWillMount() {
        const {actions,projectInfo,getUserAction} = this.props;
        if(projectInfo) {
            actions.fetchDataSource(projectInfo.id);
            getUserAction.getAllUser();
            var data ={project_id:projectInfo.id};
            actions.getIssueList(data);
        }else{
            const {router} = this.context;
            router.goBack();
            this.errChosePro();
        }
    }

    // componentDidMount() {
    //
    // }

    // shouldComponentUpdate(nextProps, nextState){
    //         return true;
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
        const thisProId = projectInfo?projectInfo.id:'';
        const nextProId = nextProps.projectInfo?nextProps.projectInfo.id:'';
        const errorMsg = nextProps.errors;
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            actions.getIssueList(nextProps.projectInfo.id,0);
            actions.fetchDataSource(nextProps.projectInfo.id);
        }

        // if(errorMsg&&errorMsg!=this.props.errors){
        //     // message.error('获取数据失败'+errorMsg,3);
        //     this.errorMessage('获取数据失败!',errorMsg);
        // }
    }

    // errorMessage(info,error){
    //     notification.error({
    //         message: info,
    //         description:error,
    //         duration:null,
    //     });
    // }

    handleReset(e) {
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,projectInfo,form} = this.props;
        const data = form.getFieldsValue();
        // console.log("查询条件：",data);

        var dataList ={
            project_id:projectInfo.id,
            milestone_id:data.milestone,
            assigned_id:data.assignee,
            author_id:data.author_name,
            state:data.state,
            labeles:data.label,
            start:data.created_at&&data.created_at.length>0?data.created_at[0]:'',
            end:data.created_at&&data.created_at.length>0?data.created_at[1]:'',
            due_start:data.due_date&&data.due_date.length>0?data.due_date[0]:'',
            due_end:data.due_date&&data.due_date.length>0?data.due_date[1]:'',
        };
        actions.getIssueList(dataList);
    }

    // onToggle(){
    //     if(!this.state.formSearch.display){
    //         this.setState({formSearch:{'display':'none'}});
    //     }else{
    //         this.setState({formSearch:{'display':''}});
    //     }
    // }
    editIssue(type, selectedRow) {
            this.context.router.push({
                pathname: '/issueEdit',
                state: {editType: type, selectedRow}
            });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const assignee =this.props.members?this.props.members.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const mileStoneOptions =this.props.milestones?this.props.milestones.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const label =this.props.labels?this.props.labels.map(data => <Option key={data.name}>{data.name}</Option>):[];

        const userInfo = this.props.user?this.props.user.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="查询条件" key="1">
                        <Form horizontal className={styles.ant_search_form} >
                            <Row gutter={16}>
                                <Col sm={7}>
                                    <FormItem label="里程碑" {...formItemLayout} >
                                        {getFieldDecorator('milestone')(
                                            <Select showSearch
                                                    showArrow={false}
                                                    placeholder="请选择里程碑"
                                                    optionFilterProp="children"
                                                    notFoundContent="无法找到">
                                            {mileStoneOptions}
                                        </Select>)}
                                    </FormItem>
                                    <FormItem label="修复人" {...formItemLayout} >
                                        {getFieldDecorator('assignee')(
                                            <Select showSearch
                                                    showArrow={false}
                                                    placeholder="请选择人员"
                                                    optionFilterProp="children"
                                                    notFoundContent="无法找到">
                                            {assignee}
                                        </Select>)}
                                    </FormItem>
                                    <FormItem label="状态" {...formItemLayout}>
                                         {getFieldDecorator('state')(<Select>
                                            <Option value="opened">打开</Option>
                                            <Option value="closed">关闭</Option>
                                            <Option value="reopened" >重开</Option>
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col sm={10}>
                                    <FormItem label="问题标签" {...formItemLayout}>
                                        {getFieldDecorator('label')(
                                            <Select showSearch
                                                    showArrow={false}
                                                    placeholder="请选择标签"
                                                    optionFilterProp="children"
                                                    notFoundContent="无法找到">
                                            {label}
                                        </Select>)}
                                    </FormItem>
                                    <FormItem label="创建时间" {...formItemLayout}>
                                        {getFieldDecorator('created_at')(<RangePicker size="default" />)}
                                    </FormItem>
                                    <FormItem label="计划完成时间" {...formItemLayout}>
                                        {getFieldDecorator('due_date')(<RangePicker size="default" />)}
                                    </FormItem>
                                </Col>
                                <Col sm={7}>
                                    <FormItem label="创建人"{...formItemLayout}>
                                        {getFieldDecorator('author_name')(
                                            <Select showSearch
                                                    showArrow={false}
                                                    placeholder="请选择人员"
                                                    optionFilterProp="children"
                                                    notFoundContent="无法找到">
                                            {userInfo}
                                        </Select>)}
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
                <Box title="项目问题列表信息" >
                    <Button type="primary" onClick={this.editIssue.bind(this,'add',null)}>新增问题</Button>
                    <IssueList  dataSource={this.props.issueList}
                                loading={this.props.loading}
                                loginInfo={this.props.loginInfo}
                                issueType="project"
                    >
                    </IssueList>
                </Box>
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
        loading:state.issue.loading,
        issueList: state.issue.issueList,
        errors:state.issue.errors,
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