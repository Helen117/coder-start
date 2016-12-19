/**
 * Created by helen on 2016/11/25.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,Button,Icon,Modal,Form,Input, Tooltip ,Breadcrumb, Row,Col  } from 'antd';
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
        const {selectedProjectSet,actions,requirementInfo} = this.props;
        if(selectedProjectSet&& selectedProjectSet.id.indexOf('g')!=-1 && !requirementInfo){
            actions.getDemandInfo(selectedProjectSet.selectedItemId);
        }
    }

    componentWillReceiveProps(nextProps) {

        const {actions,selectedProjectSet} = this.props;
        const {deleteResult} = nextProps;
        const thisSetId = selectedProjectSet?selectedProjectSet.selectedItemId:'';
        const nextSetId = nextProps.selectedProjectSet?nextProps.selectedProjectSet.selectedItemId:'';
        //点击不同项目集，重新加载数据
        if(thisSetId != nextSetId && nextSetId && nextProps.selectedProjectSet.id.indexOf('_g')!=-1 ){
            actions.getDemandInfo(nextSetId);
        }
        if(this.props.deleteResult != deleteResult && deleteResult){
            this.setState({
                modalVisible: false,
            });
            this.sucCallback('删除成功');
        }

    }

    sucCallback(type){
        message.success(type);
        this.props.actions.getDemandInfo(this.props.selectedProjectSet.selectedItemId);
        this.props.form.resetFields();
    }

    deleteDemand(record){
        this.setState({
            modalVisible: true,
            delRecord: record
        });
    }

    handleOk(groupInfo) {
        const demand_id = this.state.delRecord.id;
        const deleteDemandInfoAction = this.props.actions.deleteDemandInfo;
        const userId = this.props.loginInfo.userId
        deleteDemandInfoAction(demand_id,userId);
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
        this.props.form.resetFields();

    }

    editDemand(type,selectedRow){
        console.log(selectedRow)
        this.context.router.push({
            pathname: '/demandEdit',
            state: {editType:type,selectedRow}
        });

    }

    getDataSources(list){
        if(list&&list.length>0) {
            for (var i = 0; i < list.length; i++) {
                if (typeof(list[i].update_at) == "number") {
                    list[i].update_at = new Date(parseInt(list[i].update_at)).toLocaleDateString();
                }
                if (typeof(list[i].expect_due_date) == "number") {
                    list[i].expect_due_date = new Date(parseInt(list[i].expect_due_date)).toLocaleDateString();
                }
                const developer_confirm_date=list[i].developer_confirm_date? new Date(parseInt(list[i].developer_confirm_date)).toLocaleDateString() + "(开发) ":'';
                const tester_confirm_date=list[i].tester_confirm_date? new Date(parseInt(list[i].tester_confirm_date)).toLocaleDateString() + "(测试)":'';
                list[i].confirm_time = developer_confirm_date + tester_confirm_date;

                list[i].label = list[i].label_names && list[i].label_names.length > 0 ? list[i].label_names + '' : '';
                list[i].label_id = list[i].label_ids && list[i].label_ids.length > 0 ? list[i].label_ids + '' : '';
                list[i].assignee = list[i].assignee_develop_name + "(开发)、 " + list[i].assignee_test_name + "(测试)"

            }
        }
        return list;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const pagination = {
            pageSize:20,
        };

        const selectedProjectSet = this.props.selectedProjectSet;
        const projectId = selectedProjectSet? selectedProjectSet.id.indexOf('g')!=-1:'';
        if(projectId) {
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
                                        onClick={this.editDemand.bind(this, 'add', null)}>
                                    创建需求
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Table columns={this.columns(this)}
                           dataSource={this.getDataSources(this.props.requirementInfo)}
                           size="middle"
                           pagination={pagination}
                           loading={this.props.loading} />
                    <Modal title="确认删除此需求吗?"
                           visible={this.state.modalVisible}
                           onOk={this.handleOk.bind(this)}
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
        }else{
            return (
                <div className="null_type_div">
                    <span><Icon type="exclamation-circle-o" />   请选择一个项目集合</span>
                </div>
            )
        }
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
}, {
    title: '指派人员',
    dataIndex: 'assignee',
    width: '10%',
}, {
    title: '当前状态',
    dataIndex: 'state',
},{
    title: '业务范畴',
    dataIndex: 'label',
},{
    title: '创建人',
    dataIndex: 'author',
},/*{
    title: '最后操作时间',
    dataIndex: 'update_at',
},*/ {
    title: '需求确认时间',
    dataIndex: 'confirm_time',
    width: '12%',

}, {
    title: '计划完成时间',
    dataIndex: 'expect_due_date',
},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => {
        const userLimits = self.props.loginInfo.name == record.author? true: false;
        const deleteLimits = record.developer_confirm_date || record.tester_confirm_date? false: true;
        //console.log('self.props.loginInfo.name',self.props.loginInfo.name,record.author)
        return (<div>
           {/* {userLimits?
                <div>*/}
                    {deleteLimits ?
                        <span>
                            <Tooltip placement="top" title="点击删除">
                                <a style={{marginRight: 5}}>
                                    <Icon type="delete" onClick={self.deleteDemand.bind(self, record)}/>
                                </a>
                            </Tooltip>
                            <span className="ant-divider"/>
                        </span>: <div/>}
                <Tooltip placement="top" title="点击修改">
                    <a style={{marginLeft: 5}}>
                        <Icon type="edit" onClick={self.editDemand.bind(self, 'modify', record)}/>
                    </a>
                </Tooltip>
               {/*</div>:<div/>
        }*/}
        </div>)

    }
}];


function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        loading:state.request.loading,
        requirementInfo: state.request.requirementInfo,
        deleteResult: state.request.deleteResult,
        deleteLoading: state.request.deleteLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(request,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(RequirementInfo));