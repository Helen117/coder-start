/**
 * Created by helen on 2016/11/23.
 */
import React, {PropTypes,Component} from 'react';
import { Button,Form,InputNumber,Table,message,Spin,Upload,Icon,Modal,Input } from 'antd';
import TransferFilter from '../../components/transfer-filter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import {getProjectInfo,developConfirm,getConfirmList,getDemandList,developerUpdateConfirm,getDemandProjectInfo} from './action';
import {getApproveList} from '../approve/actions/approve-action'
import ConfirmList from './confirm-list'
import * as home from '../home/actions/home-action';


const confirm = Modal.confirm;
const FormItem = Form.Item;
 class DevelopConfirm  extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

     componentWillReceiveProps(nextProps) {
         const {confirmList,confirmResult,demandInfo} = nextProps;
         if(this.props.confirmList != confirmList && confirmList) {
                 this.props.getProjectInfoAction(confirmList[0].set_id, this.props.loginInfo.userId)
         }
         if(this.props.demandInfo != demandInfo && demandInfo){
             this.props.getDemandProjectInfoAction(demandInfo.id);
             this.props.getProjectInfoAction(demandInfo.sets_id, this.props.loginInfo.userId);
         }

         if(this.props.confirmResult != confirmResult && confirmResult){
             this.insertCallback('确认成功')
         }
     }

     insertCallback(type){
         message.success(type);
         this.props.home.getNotifyItems(this.props.loginInfo.userId);
         this.props.getApproveListAction(this.props.loginInfo.username);
         this.context.router.goBack();
     }

    handleChange(targetKeys){
        this.targetKeys = targetKeys;
    }

    approve(){
        const {form,confirmList,loginInfo,demandInfo} = this.props;
        form.setFieldsValue({'files':this.state.fileList});

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                if(this.props.task_id){
                    data.pass = true;
                    data.task_id = this.props.task_id;
                    data.demand_id = confirmList[0].demand_id;
                    data.role = confirmList[0].role;
                    data.username = loginInfo.username;
                    data.files= this.state.fileList;
                    this.props.ConfirmAction(data)
                }else{
                    data.assigned_id = loginInfo.userId;
                    data.demand_id=demandInfo.id;
                    this.props.developerUpdateConfirmAction(data);
                }
            }
        })
    }

     handleCancel() {
         const {form} = this.props;
         const {router} = this.context;

         confirm({
             title: '您是否确定要取消表单的编辑',
             content: '取消之后表单内未提交的修改将会被丢弃',
             onOk() {
                 router.goBack();
                 form.resetFields();
             },
             onCancel() {
             }
         })
     }

     beforeUpload(file){
          // console.log(file);
         if(this.props.confirmList&&this.props.confirmList[0].role=='tester'){
             if (!(file.type === 'application/vnd.ms-excel')) {
                 message.error('上传的案例限制为excel2003版本的文件(IIMP暂时不支持EXCEL2007版本的文件)！',5);
                 return false;
             }
         }else{
             if (!(file.type === 'application/msword')) {
                 message.error('上传的设计文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
                 return false;
             }
         }

         if(file.size/ 1024 / 1024 > 10){
             message.error('文件大小不能超过10M',3);
             return false;
         }
         let reader = new FileReader();
         reader.onloadend = function () {
             this.setState({
                 fileList:[{
                     uid: file.uid,
                     name: file.name,
                     status: 'done',
                     url: reader.result
                 }]
             });
         }.bind(this);
         reader.readAsDataURL(file);
         //reader.readAsArrayBuffer(file);
         this.props.form.setFieldsValue({'files':this.state.fileList});
         return false;
     }


    render() {



        const { getFieldDecorator } = this.props.form;
        let role = this.props.confirmList?this.props.confirmList[0].role:'';
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const projectInfo = this.props.getMyProjectInfo?this.props.getMyProjectInfo:[];
        let targetKeys = this.props.getDemandProjectInfo?this.props.getDemandProjectInfo.map(data => data.id):[];
        const confirmLoading = this.props.confirmLoading? true:false;

        const { getConfirmListLoading,getMyProjectLoading} = this.props;
        const TransferLoading = getMyProjectLoading? true: false;
        const dataLoading = getMyProjectLoading||getConfirmListLoading ?true: false;
        if(!this.props.task_id){
            role ='developer';
        }else{
            targetKeys=[]
        }
        if(this.props.showConfirm){
        return(
            <Box title="需求确认">
                <Spin spinning={dataLoading} tip="正在加载数据，请稍候...">
                    <Form horizontal>
                        {role == 'developer' ?
                            <FormItem   {...formItemLayout} label="涉及项目">
                                    {getFieldDecorator('projects',{rules:[{required:true,type:"array",message:'请选择项目'}]})
                                    (<TransferFilter dataSource = {projectInfo}
                                                     onChange={this.handleChange.bind(this)}
                                                     loadingProMsg={TransferLoading}
                                                    //fetchProMsgErr ={this.props.fetchProMsgErr}
                                                    targetKeys = {targetKeys}
                                    />)}
                            </FormItem>:<div></div>
                            }

                        <FormItem {...formItemLayout} label="工时" >
                            {getFieldDecorator('design_work_time',{rules:[{required:true,type:"number",message:'请填写工时'}]})(<InputNumber min={1} max={100}/>)}
                        </FormItem>

                        <FormItem {...formItemLayout}  label={role == 'developer' ?"设计文档上传":"测试案例上传"}>
                            {getFieldDecorator('files',{rules:[{required:true,type:"array",message:'请上传文档'}]})(
                                <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>)}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 16, offset: 6 }}>
                            <Button type="primary" onClick={this.approve.bind(this)} loading={confirmLoading}>确认</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </Box>
        )}else{
            return null;
        };

    }
}

DevelopConfirm.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        getConfirmListLoading: state.toBeConfirmedItem.getConfirmListLoading,
        confirmList: state.toBeConfirmedItem.confirmList,
        demandInfo: state.toBeConfirmedItem.demand,
        getMyProjectLoading: state.toBeConfirmedItem.loading,
        getMyProjectInfo: state.toBeConfirmedItem.projectInfo,
        confirmLoading: state.toBeConfirmedItem.confirmLoading,
        confirmResult: state.toBeConfirmedItem.confirmResult,
        getDemandProjectInfo: state.toBeConfirmedItem.demandProjectInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProjectInfoAction: bindActionCreators(getProjectInfo, dispatch),
        ConfirmAction: bindActionCreators(developConfirm, dispatch),
        getApproveListAction: bindActionCreators(getApproveList, dispatch),
        home:bindActionCreators(home, dispatch),
        developerUpdateConfirmAction: bindActionCreators(developerUpdateConfirm, dispatch),
        getDemandProjectInfoAction: bindActionCreators(getDemandProjectInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DevelopConfirm));
