/**
 * Created by zhaojp on 2016/12/15.
 */
/**
 * Created by helen on 2016/11/7.
 */
import React, {PropTypes,Component} from 'react';
import { Form,Table,Collapse,message,Spin,Icon  } from 'antd';
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
        actions.approvalDetail(record.task_id);
    }

    componentWillReceiveProps(nextProps) {
        const {approveMrResult,approvalDetail} = nextProps;
        if (approveMrResult && approveMrResult!=this.props.approveMrResult) {
            message.success('审批成功！');
            this.props.home.getNotifyItems(this.props.logInfo.userId);
            this.context.router.goBack();
        }
    }

    viewCodeChanges(){
        const {approvalDetail,actions} = this.props;
        if(approvalDetail){
            actions.MrCodeChanges(approvalDetail[0].project_id,approvalDetail[0].mr_id)
        }
    }

    approve(type){
        const {actions,approvalDetail,logInfo} = this.props;
        const {record} = this.props.location.state;
        const data = {};
        data.username = logInfo.username;
        data.task_id = record.task_id;
        data.project_id = approvalDetail[0].project_id;
        data.mr_id = approvalDetail[0].mr_id;
        if (type == 'accept') {
            data.pass = true;
            actions.approveMr(data);
        } else {
            data.pass = false;
            actions.approveMr(data);
        }
    }



    render() {
        const {codeChanges,approvalDetail,getDetailLoading,approveMrLoading,codeChangesLoading} = this.props;
        const loading = approveMrLoading?true:false;
        const showChanges = codeChanges?codeChanges.changes.map((data,index) => <CodeView key={index} code={data.diff}/>):null;
        return(
            <Box title="代码合并审批">
                <Spin spinning={loading} tip="正在提交，请稍候..." >
                    <Table columns={this.columns(this)}
                           dataSource={approvalDetail}
                           bordered
                           size="middle"
                           loading={getDetailLoading}
                           pagination={false}
                    />
                </Spin>
                {!codeChanges?<div style={{textAlign:"right", marginTop:10}}>
                    <a onClick={this.viewCodeChanges.bind(this)}>查看代码变更详情</a>
                </div>:<div style={{height:10}}></div>}
                {codeChangesLoading?
                    <span className="filter-not-found">
                        <i className="anticon anticon-loading"><span style={{paddingLeft:5}}>'正在加载数据...'</span></i>
                    </span>:
                    codeChanges && codeChanges.changes.length<1?
                        <div className="null_type_div">
                            <span><Icon type="exclamation-circle-o" />   没有代码变更</span>
                        </div>:showChanges}
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
},{
    title: '名称',
    dataIndex: 'title',
},{
    title: '描述',
    dataIndex: 'description',
    width: '20%',
},{
    title: '里程碑',
    dataIndex: 'milestone',
},{
    title: '需求',
    dataIndex: 'request',
},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => (
        <div>
            <a onClick={self.approve.bind(self,'accept')}>接受</a>
            <span style={{marginLeft:10,marginRight:10}} className="ant-divider"/>
            <a onClick={self.approve.bind(self,'close')}>关闭</a>
        </div>


    )
}];



MrApproval = Form.create()(MrApproval);


//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        logInfo: state.login.profile,
        getDetailLoading:state.approve.getDetailLoading,
        approvalDetail:state.approve.approvalDetail,
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