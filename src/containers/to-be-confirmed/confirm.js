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
import {getProjectInfo,developConfirm} from './action';
import {getApproveList} from '../approve/actions/approve-action'
import ConfirmList from './confirm-list'


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
         const {confirmList,confirmResult} = nextProps
         if(this.props.confirmList != confirmList && confirmList) {
            this.props.getProjectInfoAction(confirmList[0].set_id,this.props.loginInfo.userId)
         }
         if(this.props.confirmResult != confirmResult && confirmResult){
             this.insertCallback('需求确认成功')
         }
     }

     insertCallback(type){
         message.success(type);
         this.props.getApproveListAction(this.props.loginInfo.username);
         this.context.router.goBack();
     }

    handleChange(targetKeys){
        this.targetKeys = targetKeys;
    }


    approve(){
        const {form,confirmList,loginInfo} = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.pass = true;
                data.task_id = this.props.location.state.record.task_id;
                data.demand_id = confirmList[0].demand_id;
                data.role = confirmList[0].role;
                data.username = loginInfo.username;
                this.props.ConfirmAction(data)
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


    render() {

        const { getFieldDecorator } = this.props.form;
        const {task_id} = this.props.location.state.record;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const props = {
            action: '/upload.do',
            beforeUpload(file){
                const isWord = file.type === 'application/msword';//'application/vnd.ms-excel'
                if (!isWord) {
                    message.error('只能上传word文档',3);
                }
                return isWord;
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                    let fileList = info.fileList;

                    fileList = fileList.map((file) => {
                        if (file.response) {
                            file.url = file.response.url;
                        }
                        return file;
                    });

                    this.setState({ fileList });

                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`,3);
                }
            },
        };
        const projectInfo = this.props.getMyProjectInfo?this.props.getMyProjectInfo:[];
        const confirmLoading = this.props.confirmLoading? true:false;
        const role = this.props.confirmList?this.props.confirmList[0].role:'';
        const { getConfirmListLoading,getMyProjectLoading} = this.props;
        const TransferLoading = getMyProjectLoading? true: false;
        const dataLoading = getMyProjectLoading||getConfirmListLoading ?true: false;

        return(
            <Box title="需求确认">
                <Spin spinning={dataLoading} tip="正在加载数据，请稍候...">
                    <ConfirmList task_id={task_id}/>
                    <Form horizontal>
                        {role == 'developer' ?
                            <FormItem   {...formItemLayout} label="涉及项目">
                                    {getFieldDecorator('projects',{rules:[{required:true,type:"array",message:'请选择项目'}]})
                                    (<TransferFilter dataSource = {projectInfo}
                                                     onChange={this.handleChange.bind(this)}
                                                     loadingProMsg={TransferLoading}
                                                    //fetchProMsgErr ={this.props.fetchProMsgErr}
                                                    //targetKeys = {targetKeys}
                                    />)}
                            </FormItem>:<div></div>
                            }

                        <FormItem {...formItemLayout} label="设计工时" >
                            {getFieldDecorator('design_work_time',{rules:[{required:true,type:"number",message:'请填写设计工时'}]})(<InputNumber min={1} max={100}/>)}
                        </FormItem>

                        <FormItem {...formItemLayout}  label="设计文档上传" >
                            {getFieldDecorator('files')(
                                <Upload {...props} fileList={this.state.fileList}>
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

DevelopConfirm.prototype.columns = (self)=>[{
    title: '工单名称',
    dataIndex: 'name',
    width: '20%',
},{
    title: '内容',
    dataIndex: 'description',
    width: '20%',
},{
    title: '计划上线时间',
    dataIndex: 'due_date',
    width: '20%',
}, {
    title: '负责人',
    dataIndex: 'director',
    width: '20%',
}];


function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        getConfirmListLoading: state.toBeConfirmedItem.getConfirmListLoading,
        confirmList: state.toBeConfirmedItem.confirmList,
        getMyProjectLoading: state.toBeConfirmedItem.loading,
        getMyProjectInfo: state.toBeConfirmedItem.projectInfo,
        confirmLoading: state.toBeConfirmedItem.confirmLoading,
        confirmResult: state.toBeConfirmedItem.confirmResult
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProjectInfoAction: bindActionCreators(getProjectInfo, dispatch),
        ConfirmAction: bindActionCreators(developConfirm, dispatch),
        getApproveListAction: bindActionCreators(getApproveList, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DevelopConfirm));
