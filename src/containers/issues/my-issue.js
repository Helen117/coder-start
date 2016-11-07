/**
 * Created by helen on 2016/10/19.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,Select,DatePicker,Col,Row,Collapse  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';
import * as getAllUser from '../register/actions/register-action';
import IssueList from '../../components/issues-list';
import styles from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;

class MyIssueList extends Component {

    constructor(props) {
        super(props);
        this.state ={};
    }

    componentWillMount() {
        const {actions,projectInfo,loginInfo,getUserAction} = this.props;
        getUserAction.getAllUser();
        if(projectInfo){
            actions.getIssueList(projectInfo.id,loginInfo.username);
        }else{
            actions.getIssueList(null,loginInfo.username);
        }
    }

    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {
        const {actions,projectInfo,loginInfo} = this.props;

        if(projectInfo && nextProps.projectInfo && projectInfo.id != nextProps.projectInfo.id) {
            actions.getIssueList(nextProps.projectInfo.id,loginInfo.username);
        }
    }

    handleReset(e) {
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions,projectInfo,form} = this.props;
        const data = form.getFieldsValue();
    }


    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const userInfo = this.props.user?this.props.user.map(data => <Option key={data.username}>{data.name}</Option>):[];

        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="查询条件" key="1">
                        <Form horizontal className={styles.ant_search_form} >
                            <Row gutter={16}>
                                <Col sm={12}>

                                    <FormItem label="状态" {...formItemLayout}>
                                        <Select {...getFieldProps('state')}>
                                            <Option value="opened">打开</Option>
                                            <Option value="closed">关闭</Option>
                                            <Option value="reopened" >重开</Option>
                                        </Select>
                                    </FormItem>
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
                                <Col sm={12}>
                                    <FormItem label="创建时间" {...formItemLayout}>
                                        <RangePicker size="default" {...getFieldProps('created_at')}/>
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
                <IssueList  dataSource={this.props.issueList}
                            loading={this.props.loading}
                            projectInfo={this.props.projectInfo}
                            state="myIssue"
                            loginInfo={this.props.loginInfo}
                >
                </IssueList>
            </div>
        )

    }

}

MyIssueList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

MyIssueList = Form.create()(MyIssueList);

function mapStateToProps(state) {
    return {
        issueList: state.issue.issueList,
        loading:state.issue.loading,
        projectInfo:state.getProjectInfo.projectInfo,
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

export default connect(mapStateToProps, mapDispatchToProps)(MyIssueList);