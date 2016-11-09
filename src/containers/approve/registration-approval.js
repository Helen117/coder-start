/**
 * Created by helen on 2016/11/7.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,Input,Table,Collapse,message,Spin  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as approve from './actions/approve-action';

const FormItem = Form.Item;
class RegistrationApproval  extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const {actions} = this.props;
        const {record} = this.props.location.state;
        actions.approvalDetail(record.task_id);
    }

    componentWillReceiveProps(nextProps) {
        const nextResult = nextProps.result;
        const nextError = nextProps.error;
        const commit = nextProps.commitLoading;
        const getDetailError = nextProps.getDetailError;

        if(getDetailError&& getDetailError != this.props.getDetailError){
            message.error('获取待审批详情失败！'+getDetailError,3);
        }
        if(nextError&& nextError != this.props.error){
            message.error('审批失败！'+nextError,3);
        }
        if (!commit && !nextError && nextResult && nextResult!=this.props.result) {
            message.success('审批成功！');
            this.context.router.goBack();
        }
    }


    approve(type){
        const {actions,form,loginInfo} = this.props;
        const {record} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.username = loginInfo.username;
                data.task_id = record.task_id;
                if (type == 'agree') {
                    data.result = true;
                    actions.approveResult(data);
                } else {
                    data.reason = false;
                    actions.approveResult(data);
                }
            }
        })
    }


    render() {

        const { getFieldProps } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 12 },
        };

        const loading = this.props.commitLoading?true:false;

        return(
            <Box title="注册审批">
                <Spin spinning={loading} tip="正在提交，请稍候..." >
                    <Table columns={this.columns(this)} dataSource={this.props.approvalDetail}
                           bordered
                           size="middle"
                           loading={this.props.getDetailLoading}
                    />
                    <div style={{marginTop: 16}}>
                        <Form horizontal>
                            <FormItem {...formItemLayout} label="审批原因" >
                                <Input type="textarea" placeholder="reason" rows="5"  {...getFieldProps('reason',{rules:[{required:true,message:'不能为空'}]})} />
                            </FormItem>
                            <FormItem wrapperCol={{ span: 16, offset: 6 }}>
                                <Button type="primary" onClick={this.approve.bind(this, 'agree')}>同意</Button>
                                <Button type="primary" onClick={this.approve.bind(this, 'disagree')}>不同意</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Spin>
            </Box>
        );
    }
}

RegistrationApproval.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

RegistrationApproval.prototype.columns = (self)=>[{
    title: '姓名',
    dataIndex: 'fullname',
    width: '20%',
},{
    title: '登录名',
    dataIndex: 'initiator',
    width: '20%',
},{
    title: '邮箱',
    dataIndex: 'userEmail',
    width: '20%',
}, {
    title: '申请角色',
    dataIndex: 'userRole',
    width: '20%',
}];



RegistrationApproval = Form.create()(RegistrationApproval);


//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        getDetailLoading:state.approve.getDetailLoading,
        approvalDetail:state.approve.approvalDetail,
        getDetailError:state.approve.getDetailError,
        commitLoading:state.approve.commitLoading,
        result:state.approve.approveResult,
        error:state.approve.resultErrors,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(approve,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RegistrationApproval);