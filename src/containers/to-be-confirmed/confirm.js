/**
 * Created by helen on 2016/11/23.
 */
/**
 * Created by helen on 2016/11/7.
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
        const {record} = this.props.location.state;
        if(record.task_id){
            this.props.getConfirmListAction(record.task_id);
        }else {
            this.props.getDemandListAction(record.sets_issue_id);
        }
    }

     componentWillReceiveProps(nextProps) {
         const {confirmList,confirmResult,demandInfo} = nextProps
         if(this.props.confirmList != confirmList && confirmList) {
                 this.props.getProjectInfoAction(confirmList[0].set_id, this.props.loginInfo.userId)
         }
         if(this.props.demandInfo != demandInfo && demandInfo){
             this.props.getDemandProjectInfoAction(this.props.location.state.record.sets_issue_id);
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
     getDataSource(confirmList){
         if(confirmList){
             for(let i=0; i<confirmList.length; i++){
                 confirmList[i].created_at = new Date(confirmList[i].created_at).toLocaleDateString();
                 confirmList[i].due_date = new Date(confirmList[i].due_date).toLocaleDateString();
                 if (confirmList[i].type == 'demand') {
                     confirmList[i].type = '需求';
                 }
             }
         }
         return confirmList;
     }


    approve(){
        const {form,confirmList,loginInfo} = this.props;
        const {record} = this.props.location.state;
        form.setFieldsValue({'files':this.state.fileList});

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                if(record.task_id){
                    data.pass = true;
                    data.task_id = record.task_id;
                    data.demand_id = confirmList[0].demand_id;
                    data.role = confirmList[0].role;
                    data.username = loginInfo.username;
                    data.files= this.state.fileList;
                    this.props.ConfirmAction(data)
                }else{
                    data.assigned_id = loginInfo.userId;
                    data.demand_id=record.sets_issue_id;
                    console.log(data);
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
         if(this.props.confirmList&&this.props.confirmList[0].role=='developer'){
             if (!(file.type === 'application/msword')) {
                 message.error('上传的设计文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
                 return false;
             }
         }else{
             if (!(file.type === 'application/vnd.ms-excel')) {
                 message.error('上传的案例限制为excel2003版本的文件(IIMP暂时不支持EXCEL2007版本的文件)！',5);
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

        const confirmList = this.props.confirmList;
        const loading = this.props.getConfirmListLoading?true:false;
        let data = this.getDataSource(confirmList)

        const { getFieldDecorator } = this.props.form;
        const {record} = this.props.location.state;
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
        if(!record.task_id){
            data = [{
                'name':record.issue_name,
                'description':record.description,
                'type':record.issueType,
                'filesName':this.props.demandInfo?this.props.demandInfo.files:'',
                'author':record.author_name,
                'created_at':record.created_at,
                'due_date':record.due_date
            }];
            role ='developer';
            targetKeys=[]
        }
        return(
            <Box title="需求确认">
                <Spin spinning={dataLoading} tip="正在加载数据，请稍候...">
                    <ConfirmList data={data}/>
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
        )
    }
}

DevelopConfirm.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

// DevelopConfirm.prototype.columns = (self)=>[{
//     title: '工单名称',
//     dataIndex: 'name',
//     width: '20%',
// },{
//     title: '内容',
//     dataIndex: 'description',
//     width: '20%',
// },{
//     title: '计划上线时间',
//     dataIndex: 'due_date',
//     width: '20%',
// }, {
//     title: '负责人',
//     dataIndex: 'director',
//     width: '20%',
// }];


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
        getConfirmListAction: bindActionCreators(getConfirmList, dispatch),
        getDemandListAction: bindActionCreators(getDemandList, dispatch),
        developerUpdateConfirmAction: bindActionCreators(developerUpdateConfirm, dispatch),
        getDemandProjectInfoAction: bindActionCreators(getDemandProjectInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DevelopConfirm));
