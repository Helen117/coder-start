/**
 * Created by zhaojp on 2016/10/11.
 */
/**
 * Created by zhaojp on 2016/10/8.
 */

import React,{ PropTypes } from 'react';
import {Button,Table, Modal,Row, Icon, Tooltip, Spin, message,Form,Input} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchBranchesData,deleteBranch} from './branches-action';

const createForm = Form.create;
const confirm = Modal.confirm;
const FormItem = Form.Item;
class BranchesList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            modalVisible: false,
            delRecord: {}
        }
    }

    componentWillMount() {
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        if(projectInfo && projectInfo.id) {
            if(!this.props.branchesData || this.props.branchesData.project_id!=projectInfo.id) {
                this.props.fetchBranchesData(projectInfo.id);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const delResult = nextProps.delResult;
        const {project} = this.props;
        const next_project = nextProps.project;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        let next_projectInfo = next_project.getProjectInfo?(
            next_project.getProjectInfo.projectInfo?next_project.getProjectInfo.projectInfo:{}
        ):{};

        const thisProId = projectInfo.id;
        const nextProId = next_projectInfo.id;
        //点击不同项目，重新加载数据
        if(thisProId != nextProId && nextProId){
            this.props.fetchBranchesData(nextProId);
        }

        if(this.props.delResult != delResult && delResult){
            this.setState({
                modalVisible: false,
            });
            this.sucCallback('删除成功');
        }
    }

    sucCallback(type){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        message.success(type);
        const project_id = projectInfo.id;
        this.props.fetchBranchesData(project_id);
        this.props.form.resetFields();
    }

    createBranches(type){
        this.context.router.push({
            pathname: '/CreateBranches',
            state: {editType: type}
        });
    }

    deleteBranch(record){
        this.setState({
         modalVisible: true,
         delRecord: record
         });
    }

    handleOk() {
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const branch = this.state.delRecord.branch;
        const project_id = projectInfo.id;
        const result = this.props.form.getFieldsValue().result;
        const deleteBranchAction = this.props.deleteBranchAction;
        const username = this.props.loginInfo.username;
        deleteBranchAction(branch,project_id,result,username);
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
        this.props.form.resetFields();

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
        const {project,loginInfo,branchesData} = this.props;
        const data = this.mapBranchTable(branchesData);
        const {getFieldDecorator} = this.props.form;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        let buttonDisable=true;
        if(projectInfo && loginInfo){
            if(projectInfo.owner_id==loginInfo.userId && projectInfo.id){
                buttonDisable = false;
            }
        }

        return(
            <div style={{margin:10}}>
                <Row >
                    <Button className="pull-right" type="primary"
                            disabled={buttonDisable}
                            onClick={this.createBranches.bind(this,'add')}>创建分支</Button>
                </Row>
                <div style={{marginTop:5}}>
                    <Table loading = {this.props.getBranchLoading}
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
    render: (text, record) => {
        const {project,loginInfo} = self.props;
        let projectInfo = project.getProjectInfo?(
            project.getProjectInfo.projectInfo?project.getProjectInfo.projectInfo:{}
        ):{};
        return (
        record.branch=="master"|| record.branch=="release" || record.branch=="dev"|| projectInfo.owner_id!=loginInfo.userId?
            <dev></dev>:
            <Tooltip placement="top" title="点击删除">
                <Icon type="delete" onClick={self.deleteBranch.bind(self,record)}/>
            </Tooltip>

    )}
}]


BranchesList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        branchesData: state.branch.branchesData,
        getBranchLoading: state.branch.getBranchLoading,
        delLoading: state.branch.deleteLoading,
        delResult: state.branch.deleteResult,
        currentTwoInfo:state.getMenuBarInfo.currentTwo,
        project:state.project,
    };
}

function mapDispatchToProps(dispatch){
    return{
        fetchBranchesData : bindActionCreators(fetchBranchesData,dispatch),
        deleteBranchAction: bindActionCreators(deleteBranch,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(BranchesList))