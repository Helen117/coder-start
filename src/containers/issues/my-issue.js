/**
 * Created by helen on 2016/10/19.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,Select,DatePicker,Col,Row,Collapse,message,notification  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';
import * as getAllUser from '../register/actions/register-action';
import IssueList from '../../components/issues-list';
import styles from './index.css';
import Box from '../../components/box';

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
        const {data} = this.props.location.state?this.props.location.state:'';
        var dataList ={};
        getUserAction.getAllUser();
        if(data){
            dataList = data;
        }else{
            dataList.project_id=projectInfo?projectInfo.id:'';
            dataList.assigned_id=loginInfo.userId;
        }
        actions.getMyIssue(dataList);
    }

    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {
        // console.log('nextProps:',nextProps);
        const {actions,projectInfo,loginInfo,myIssueError} = this.props;
        if(nextProps.location.state && this.props.location.state!=nextProps.location.state){
            actions.getMyIssue(nextProps.location.state.data);
        }
        const thisProId = projectInfo?projectInfo.id:'';
        const nextProId = nextProps.projectInfo?nextProps.projectInfo.id:'';
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            var data ={
                project_id:nextProps.projectInfo.id,
                assigned_id:loginInfo.userId,
            };
            actions.getMyIssue(data);
        }

        // if(myIssueError&&myIssueError!=this.props.myIssueError){
        //     // message.error('获取数据失败'+myIssueError,3);
        //     this.errorMessage('获取数据失败!',myIssueError);
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
        const {actions,projectInfo,form,loginInfo} = this.props;
        const data = form.getFieldsValue();
        // console.log("查询条件：",data);

        var dataList ={
            project_id:projectInfo?projectInfo.id:'',
            assigned_id:loginInfo.userId,
            author_id:data.author_name,
            state:data.state,
            start:data.created_at&&data.created_at.length>0?data.created_at[0]:'',
            end:data.created_at&&data.created_at.length>0?data.created_at[1]:'',
            due_start:data.due_date&&data.due_date.length>0?data.due_date[0]:'',
            due_end:data.due_date&&data.due_date.length>0?data.due_date[1]:'',
        };
        actions.getMyIssue(dataList);
    }

    editIssue(type, selectedRow) {
        if (!this.props.projectInfo) {
            notification.error({
                message: '未选择项目',
                description: '请先在“代码管理“中选择一个项目！',
                duration: 2
            });
        } else {
            this.context.router.push({
                pathname: '/issueEdit',
                state: {editType: type, selectedRow}
            });
        }
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const userInfo = this.props.user?this.props.user.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="查询条件" key="1">
                        <Form horizontal className={styles.ant_search_form} >
                            <Row gutter={16}>
                                <Col sm={12}>

                                    <FormItem label="状态" {...formItemLayout}>
                                        {getFieldDecorator('state')(<Select >
                                            <Option value="opened">打开</Option>
                                            <Option value="closed">关闭</Option>
                                            <Option value="reopened" >重开</Option>
                                        </Select>)}
                                    </FormItem>
                                    <FormItem label="创建人"{...formItemLayout}>
                                            {getFieldDecorator('author_name')(
                                                <Select showSearch
                                                        showArrow={false}
                                                        placeholder="请选择人员"
                                                        optionFilterProp="children"
                                                            notFoundContent="无法找到">
                                                    {userInfo}
                                                </Select>)
                                            }
                                    </FormItem>
                                </Col>
                                <Col sm={12}>
                                    <FormItem label="创建时间" {...formItemLayout}>
                                        {getFieldDecorator('created_at')(<RangePicker size="default" />)}
                                    </FormItem>
                                    <FormItem label="计划完成时间" {...formItemLayout}>
                                        {getFieldDecorator('due_date')(<RangePicker size="default" />)}
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
                <Box title="我的问题列表信息" >
                    <Button type="primary" onClick={this.editIssue.bind(this,'add',null)}>新增问题</Button>
                    <IssueList  dataSource={this.props.issueList}
                                loading={this.props.loading}
                                loginInfo={this.props.loginInfo}
                    >
                    </IssueList>
                </Box>
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
        issueList: state.issue.myIssueList,
        loading:state.issue.myIssueLoading,
        myIssueError:state.issue.myIssueError,
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