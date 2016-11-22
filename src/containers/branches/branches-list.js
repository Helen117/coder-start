/**
 * Created by zhaojp on 2016/10/11.
 */
/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import {Button,Table, Modal,notification,Row, Icon, Tooltip, Spin, message,Form,Input} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetchBranchesData from './actions/fetch-branches-action';
import deleteBranch from './actions/branches-delete-action'

const createForm = Form.create;
const confirm = Modal.confirm;
const FormItem = Form.Item;
class branchesList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            modalVisible: false,
            delRecord: {}
        }
    }

    componentWillMount() {
        if(this.props.getProjectInfo) {
            if(!this.props.branchesData) {
                this.props.fetchBranchesData(this.props.getProjectInfo.id);
            }
        }/*else{
            const {router} = this.context;
            router.goBack();
            this.errChosePro();
        }*/
    }

    componentWillReceiveProps(nextProps) {
        const fetchErrors = nextProps.fetchErrors;
        const delErrMessage = nextProps.delErrMessage;
        const delResult = nextProps.delResult;
        const thisProId = this.props.getProjectInfo?this.props.getProjectInfo.id:'';
        const nextProId = nextProps.getProjectInfo?nextProps.getProjectInfo.id:'';
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId!=''){
            this.props.fetchBranchesData(nextProId);
        }
        //数据加载错误提示
        if(this.props.fetchErrors != fetchErrors && fetchErrors){
            this.errCallback('获取数据失败',fetchErrors);
        }
        if(this.props.delErrMessage != delErrMessage && delErrMessage){
            this.errCallback('删除数据失败',delErrMessage);
        }else if(this.props.delResult != delResult && delResult){
            this.setState({
                modalVisible: false,
            });
            this.sucCallback('删除成功');
            this.props.fetchBranchesData(thisProId);
        }
    }

    sucCallback(type){
        message.success(type);
        const project_id = this.props.getProjectInfo.id;
        this.props.fetchBranchesData(project_id);
    }

    errCallback(type,fetchErrors){
        notification.error({
            message: type,
            description: fetchErrors,
            duration: 2
        });
    }

    createBranches(type){
        this.context.router.push({
            pathname: '/createBranches',
            state: {editType: type}
        });
    }

    deleteBranch(record){
        this.setState({
         modalVisible: true,
         delRecord: record
         });
    }

    handleOk(groupInfo) {
        const branch = this.state.delRecord.branch;
        const project_id = this.props.getProjectInfo.id;
        const result = this.props.form.getFieldsValue().result;
        const deleteBranchAction = this.props.deleteBranchAction;
        deleteBranchAction(branch,project_id,result);
        this.props.form.resetFields();
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
    }

    onChange(pagination, filters, sorter) {
        // 点击分页、筛选、排序时触发
    }

    mapBranchTable(branch){
        const data = [];
        if(branch != [] && branch){
            for (let i = 0; i < branch.branch.length; i++) {
                data.push({
                    key: branch.branch[i],
                    branch: branch.branch[i],
                });
            }
        }
        return data;
    }

    render(){
        const branch = this.props.branchesData;
        const data = this.mapBranchTable(branch);
        const {getFieldDecorator} = this.props.form;
/*        const deleteResultProps = getFieldProps('result',
            {rules:[ {required:true, message:'请输入删除原因！'}]});*/
        return(

            <div style={{margin:15}}>
                <Spin spinning={this.props.delLoading} tip="正在删除数据">
                    <Row >
                        <Button className="pull-right" type="primary"
                                disabled={this.props.getProjectInfo?false:true}
                                onClick={this.createBranches.bind(this,'add')}>创建分支</Button>
                    </Row>
                    <div style={{marginTop:5}}>
                        <Table loading = {this.props.loading}
                               onChange={this.onChange.bind(this)}
                               columns={columns(this)}
                               dataSource={data}
                                />
                    </div>
                    <div>
                        <Modal title="确认删除此分支吗?"
                               visible={this.state.modalVisible}
                               onOk={this.handleOk.bind(this)}
                               confirmLoading={this.props.delLoading}
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
                </Spin>
            </div>
            )
    }
}
//
const columns = (self)=>[{
    title: '分支',
    dataIndex: 'branch',
    key: 'branch',
    //sorter: (a, b) => a.branch - b.branch
},{
    title: '操作',
    dataIndex: 'key',
    width: '10%',
    render: (text, record) => (
        record.branch=="master"|| record.branch=="release" || record.branch=="dev"?
            <dev></dev>:
            <Tooltip placement="top" title="点击删除">
                <Icon type="delete" onClick={self.deleteBranch.bind(self,record)}/>
            </Tooltip>

    )
}]


branchesList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        getProjectInfo:state.getProjectInfo.projectInfo,
        branchesData: state.fetchBranches.branchesData,
        loading: state.fetchBranches.loading,
        fetchErrors: state.fetchBranches.fetchErrors,
        delLoading: state.deleteBranch.loading,
        delErrMessage: state.deleteBranch.errorMsg,
        delResult: state.deleteBranch.result,
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchBranchesData : bindActionCreators(fetchBranchesData,dispatch),
        deleteBranchAction: bindActionCreators(deleteBranch,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(branchesList))