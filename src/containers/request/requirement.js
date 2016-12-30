/**
 * Created by helen on 2016/11/25.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,Button,Icon,Modal,Form,Input, Alert ,Breadcrumb, Row,Col  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as request from './actions/request-action';


const createForm = Form.create;
const FormItem = Form.Item;
class RequirementInfo extends Component {

    constructor(props) {
        super(props);
        this.state={
            modalVisible: false,
            delRecord: {}
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        const {deleteResult} = nextProps;
        if(this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                modalVisible: false,
            });
            this.sucCallback('删除成功');
        }

    }

    sucCallback(type){
        message.success(type);
        this.props.actions.getRequestInfo(this.props.page, this.props.condition);
        this.props.form.resetFields();
    }

    deleteRequest(record){
        this.setState({
            modalVisible: true,
            delRecord: record
        });
    }

    handleDelete() {
        const request_id = this.state.delRecord.id;
        const deleteRequestInfoAction = this.props.actions.deleteRequestInfo;
        const userId = this.props.loginInfo.userId
        deleteRequestInfoAction(request_id,userId);
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
        this.props.form.resetFields();

    }

    changePage(pagination, filters, sorter) {
        const {actions} = this.props;
        actions.requestQueryCondition(pagination.current, this.props.condition);
        actions.getRequestInfo(pagination.current, this.props.condition);
    }


    editRequest(type,selectedRow){
        this.context.router.push({
            pathname: '/requestEdit',
            state: {editType:type,selectedRow}
        });

    }

    getDataSources(list){
        if(list&&list.length>0) {
            for (var i = 0; i < list.length; i++) {
                if (typeof(list[i].expect_due_date) == "number") {
                    list[i].expect_due_date = new Date(parseInt(list[i].expect_due_date)).toLocaleDateString();
                }
                if (typeof(list[i].deadline_date) == "number") {
                    list[i].deadline_date = new Date(parseInt(list[i].deadline_date)).toLocaleDateString();
                }
                /*const developer_confirm_date=list[i].developer_confirm_date? new Date(parseInt(list[i].developer_confirm_date)).toLocaleDateString() + "(开发) ":'';
                const tester_confirm_date=list[i].tester_confirm_date? new Date(parseInt(list[i].tester_confirm_date)).toLocaleDateString() + "(测试)":'';
                list[i].confirm_time = developer_confirm_date + tester_confirm_date;*/
                if(list[i].labels&&list[i].labels.length>0){
                    list[i].label_names=[];
                    list[i].label_ids =[];
                    for(let j=0;j<list[i].labels.length;j++){
                        list[i].label_names.push(list[i].labels[j].name);
                        list[i].label_ids.push(list[i].labels[j].id);
                    }
                }
                list[i].label = list[i].label_names && list[i].label_names.length > 0 ? list[i].label_names + '' : '';
                list[i].label_id = list[i].label_ids && list[i].label_ids.length > 0 ? list[i].label_ids + '' : '';
                list[i].assignee = list[i].assignee_develop_name + "（开发）、 " + list[i].assignee_test_name + "（测试）"

            }
        }
        return list;
    }

    render() {
        const {requirementListData} = this.props
        const {getFieldDecorator} = this.props.form;
        const dataSource = requirementListData?this.getDataSources(requirementListData.sets_Demands):[];
        const pagination = {
            total: requirementListData?requirementListData.size: 0,
            current: this.props.page
        }
        const selectedProjectSet = this.props.selectedProjectSet;
        return (
            <div style={{margin:10}}>
                <Row>
                    <Col span={12}>
                        <Breadcrumb>
                            <Breadcrumb.Item >
                                <Icon type="home" />
                                <span>{selectedProjectSet.name}</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={12}>
                        <div style={{textAlign:"right"}}>
                            <Button style={{marginBottom:5}} type="primary"
                                    onClick={this.editRequest.bind(this, 'add', null)}>
                                创建需求
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Table columns={this.columns(this)}
                       dataSource={dataSource}
                       size="middle"
                       pagination={pagination}
                       onChange={this.changePage.bind(this)}
                       loading={this.props.loading} />
                <Modal title="确认删除此需求吗?"
                       visible={this.state.modalVisible}
                       onOk={this.handleDelete.bind(this)}
                       confirmLoading={this.props.deleteLoading}
                       onCancel={this.handleCancel.bind(this)}
                >
                    <p>如果确认此操作，请在下框输入原因：</p>
                    <Form>
                        <FormItem>
                            {getFieldDecorator('result')(<Input type="textarea" rows={4} />)}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

RequirementInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


RequirementInfo.prototype.columns = (self)=>[{
    title: '里程碑',
    dataIndex: 'milestone_name',
},{
    title: '需求名称',
    dataIndex: 'title',
},  {
    title: '描述',
    dataIndex: 'description',
},{
    title: '指派人员',
    dataIndex: 'assignee',
    width: '12%',
}, {
    title: '当前状态',
    dataIndex: 'state',
},{
    title: '业务范畴',
    dataIndex: 'label',
},{
    title: '文件',
    dataIndex: 'files',
}/*, {
    title: '需求确认时间',
    dataIndex: 'confirm_time',
    width: '12%',

}*/, {
    title: '计划完成时间',
    dataIndex: 'expect_due_date',
},{
    title: '期望上线时间',
    dataIndex: 'deadline_date',
},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => {
        const userLimits = self.props.loginInfo.name == record.author? true: false;
        const updateLimits = record.state=='已完成'?  true: false;
        const deleteLimits = record.state=='进行中'?  true: false;
        return (<div>

            {record.state=='已完成'?<div/>:
            record.state=='待确认'?<span> <a onClick={self.editRequest.bind(self, 'modify', record)}>修改</a>
                    <span style={{marginRight: 5, marginLeft: 5}} className="ant-divider"/>
                    <a onClick={self.deleteRequest.bind(self, record)}>删除</a>
               </span>: <a onClick={self.editRequest.bind(self, 'modify', record)}>修改</a>
               }
        </div>)

    }
}];


function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        loading:state.request.loading,
        requirementListData: state.request.requirementInfo,
        deleteResult: state.request.deleteResult,
        deleteLoading: state.request.deleteLoading,
        page: state.request.page,
        condition: state.request.queryCondition,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(request,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(RequirementInfo));