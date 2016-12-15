/**
 * Created by zhaojp on 2016/12/15.
 */
/**
 * Created by helen on 2016/11/7.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,Input,Table,Collapse,message,Spin,notification  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import CodeView from '../../components/codeView'
import * as approve from './actions/approve-action';
import * as home from '../home/actions/home-action';

const FormItem = Form.Item;
class MrApproval  extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const {actions} = this.props;
        const {record} = this.props.location.state;
        actions.getMrDetail(record.task_id);
    }

    componentWillReceiveProps(nextProps) {
        const approveMrResult = nextProps.approveMrResult;
        if (approveMrResult && approveMrResult!=this.props.approveMrResult) {
            message.success('审批成功！');
            this.props.home.getNotifyItems(this.props.loginInfo.userId);
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
                if (type == 'accept') {
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
        const loading = this.props.approveMrLoading?true:false;
        return(
            <Box title="注册审批">
                <Spin spinning={loading} tip="正在提交，请稍候..." >
                    <Table columns={this.columns(this)} dataSource={this.props.mrDetail}
                           bordered
                           size="middle"
                           loading={this.props.mrDetailLoading}
                    />
                </Spin>
                <CodeView/>
            </Box>
        );
    }
}

MrApproval.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

MrApproval.prototype.columns = (self)=>[{
    title: '申请人',
    dataIndex: 'username',
    width: '20%',
},{
    title: '名称',
    dataIndex: 'title',
    width: '20%',
},{
    title: '描述',
    dataIndex: 'description',
    width: '20%',
}, {
    title: '合并路径',
    dataIndex: 'path',
    width: '20%',
},{
    title: '里程碑',
    dataIndex: 'milestone',
    width: '20%',
},{
    title: '需求',
    dataIndex: 'request',
    width: '20%',
}];



MrApproval = Form.create()(MrApproval);


//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        mrDetailLoading:state.approve.mrDetailLoading,
        mrDetail:state.approve.mrDetail,
        codeChanges: state.approve.codeChanges,
        codeChangesLoading: state.approve.codeChangesLoading,
        approveMrResult:state.approve.approveMrResult,
        approveMrLoading:state.approve.approveMrLoading,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(approve,dispatch),
        home:bindActionCreators(home, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MrApproval);