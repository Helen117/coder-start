/**
 * Created by helen on 2016/11/25.
 */
import React, {PropTypes,Component} from 'react';
import { Table,message,Button,Icon,Modal,Form,Input, Alert ,Breadcrumb, Row,Col  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import RequestList from '../../components/request-list';
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


    editRequest(type,selectedRow){
        this.context.router.push({
            pathname: '/requestEdit',
            state: {editType:type,selectedRow}
        });
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

    changePage(pagination) {
        const {actions} = this.props;
        actions.requestQueryCondition(pagination.current, this.props.condition);
        actions.getRequestInfo(pagination.current, this.props.condition);
    }

    render() {
        const {requirementListData} = this.props
        const {getFieldDecorator} = this.props.form;
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
                <RequestList
                       requirementListData={requirementListData}
                       onChange={this.changePage.bind(this)}
                       loading={this.props.loading}
                       deleteRequest={this.deleteRequest.bind(this)}
                       page={this.props.page}
                       editable={true}/>
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