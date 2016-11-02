import React,{ PropTypes } from 'react';
import { DatePicker, Button, Modal, Form, Input, Col,notification} from 'antd';
import Box from '../../components/box';
import {createMilestone,updateMilestone} from './actions/edit-milestones-actions';
import {getProjectSetMilestones} from './actions/milestones-action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class projectSetMilestonesEdit extends React.Component {
    constructor(props) {
        super(props);
        this.groupId = this.props.selectedProjectSet.selectedItemId;
    }

    componentDidMount() {
        const {item} = this.props.location.state;
        const form = this.props;
        if (item){
            item.description = item.description? item.description:"";
            this.props.form.setFieldsValue({'title':item.title,'due_date':new Date(item.due_date),'description':item.description});
        }else{
            if (this.props.selectedProjectSet) {
                this.props.getProjectSetMilestones(this.groupId, 1, []);
            } else {
                const {router} = this.context;
                router.goBack();
                this.errChoosePro();
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage,updateErrorMsg ,updateMsg} = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }
        if(this.props.updateErrorMsg != updateErrorMsg && updateErrorMsg){
            this.props.errUpdate(updateErrorMsg);
        }else if(this.props.updateMsg !=updateMsg && updateMsg){
            this.props.sucUpdate(updateErrorMsg);
        }

    }

    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '创建成功',
            duration: 2
        });
        this.props.getProjectSetMilestones(this.groupId, 1, []);
        this.context.router.goBack();
    }

    errCallback(errMessage){
        notification.error({
            message: '创建失败',
            description: errMessage,
            duration: 2
        });
    }

    sucUpdate(){
        notification.success({
            message: '修改成功',
            description: '修改成功',
            duration: 2
        });
        this.props.getProjectSetMilestones(this.groupId, 1, []);
        this.context.router.goBack();
    }

    errUpdate(errMessage){
        notification.error({
            message: '更新失败',
            description: errMessage,
            duration: 2
        });
    }

    errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在左侧项目树中选择一个虚拟组！',
            duration: 2
        });
    }

    nothingUpdate(){
        notification.error({
            message: '未作任何信息改动',
            description:'未作任何信息改动,无需提交表单！',
            duration: 2
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form,logInfo } = this.props;
        const {editType,item} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                formData.set_id= this.groupId;
                formData.author_id = logInfo.userId;
                if(editType == 'add'){
                    this.props.createMilestone(formData);
                }else{
                    console.log(formData.due_date);
                    if(item.title==formData.title && item.description==formData.description &&
                        new Date(item.due_date).toLocaleDateString()==new Date(formData.due_date).toLocaleDateString()){
                        this.nothingUpdate();
                    }else{
                        console.log('保存修改');
                        this.props.updateMilestoneAction(formData);
                    }
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

    checkDuedate(rule, value, callback){
        const {milestones} = this.props;
        const {editType,item} = this.props.location.state;
        let lastMilestoneDuedate = null;
        console.log('editType',editType);
        if(milestones && editType=='add'){
            if(milestones.length>0){
                let lastMilestoneDuedate = milestones[0].due_date;
                lastMilestoneDuedate = lastMilestoneDuedate+(1 * 24 * 60 * 60 * 1000);
                value = Date.parse(value);
                if (!value ) {
                    callback();
                } else if(value) {
                    setTimeout(() => {
                        if (value < lastMilestoneDuedate) {
                            callback([new Error('时间需迟于上一里程碑的计划完成时间:'+new Date(milestones[0].due_date).toLocaleDateString())]);
                        }else {
                            callback();
                        }
                    }, 500);
                }
            }else{
                callback();}
        }else{
            callback();
        }

    }

    render(){
        const {editType} = this.props.location.state;
        const {getFieldProps} = this.props.form;
        const titleProps = getFieldProps('title', {
            rules: [
                { required: true, message:'请输入里程碑名称' },
                { max: 30, message: '名称长度为 1~30 个字符' },
            ],
        });


        const dueDateProps = getFieldProps('due_date', {
            rules: [
                { required: true, type: 'date', message: '请选择结束日期' },
                { validator: this.checkDuedate.bind(this) }
            ],
        });

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };


        return(
            <Box title={editType == 'add' ? '创建里程碑' : '修改里程碑'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                    <FormItem   {...formItemLayout} label="名称">
                        <Input {...titleProps} placeholder="请输入里程碑名称" />
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述" >
                        <Input type="textarea" rows="5" placeholder="请输入里程碑描述信息" {...getFieldProps('description')} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="计划完成时间">
                            <DatePicker size="large" placeholder="计划完成时间" {...dueDateProps}/>
                    </FormItem>
                    <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit" loading={this.props.loading} disabled={this.props.disabled}>确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>

        );
    }
}

projectSetMilestonesEdit.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};



function mapStateToProps(state) {
    return {
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
        getProjectInfo: state.getProjectInfo.projectInfo,
        milestones: state.milestones.timeLineData,
        logInfo: state.login.profile,
        inserted: state.createMilestones.items,
        errMessage: state.createMilestones.errors,
        loading:state.createMilestones.loading,
        disabled:state.createMilestones.disabled,
        updateErrorMsg:state.createMilestones.errorMsg,
        updateMsg: state.createMilestones.result,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        createMilestone: bindActionCreators(createMilestone, dispatch),
        updateMilestoneAction: bindActionCreators(updateMilestone, dispatch),
        getProjectSetMilestones: bindActionCreators(getProjectSetMilestones, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(projectSetMilestonesEdit));