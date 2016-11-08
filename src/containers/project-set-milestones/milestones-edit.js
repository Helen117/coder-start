import React,{ PropTypes } from 'react';
import { DatePicker, Button, Modal, Form, Input, Col,notification, Spin} from 'antd';
import Box from '../../components/box';
import {createMilestone,updateMilestone,checkDueDate} from './actions/edit-milestones-actions';
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
            } /*else {
                const {router} = this.context;
                router.goBack();
                this.errChoosePro();
            }*/
        }
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage,updateErrorMsg ,updateMsg} = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback('创建');
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage,'创建');
        }
        if(this.props.updateErrorMsg != updateErrorMsg && updateErrorMsg){
            this.errCallback(updateErrorMsg,'修改');
        }else if(this.props.updateMsg !=updateMsg && updateMsg){
            this.insertCallback('修改');
        }

    }

    insertCallback(type){
        notification.success({
            message: type+'成功',
            description: type+'成功',
            duration: 2
        });
        this.props.getProjectSetMilestones(this.groupId, 1, []);
        this.context.router.goBack();
    }

    errCallback(errMessage,type){
        notification.error({
            message: type+'失败',
            description: errMessage,
            duration: 2
        });
    }


    /*errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在左侧项目树中选择一个项目集合！',
            duration: 2
        });
    }
*/
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
                    if(item.title==formData.title && item.description==formData.description &&
                        new Date(item.due_date).toLocaleDateString()==new Date(formData.due_date).toLocaleDateString()){
                        this.nothingUpdate();
                    }else{
                        formData.id = this.props.location.state.item.id;
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
        const item = this.props.location.state.item;
        const milestoneId = item? item.id: '';
        const set_id = item? item.set_id: this.props.selectedProjectSet.selectedItemId;
        const due_date = new Date(value).toLocaleDateString();

       /* const opts = {
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            body : 'milestone_id=12&sets_id=12&due_date='+due_date,
            mode: 'cors', // same-origin|no-cors（默认）|cors(允许不同域的请求，但要求有正确的CORs应答头信息，比如Access-Control-Allow-Origin)
            credentials: 'omit'//omit（默认，不带cookie）|same-origin(同源带cookie)|include(总是带cookie)
        };

<<<<<<< HEAD

        fetch('http://10.10.156.148:11000/gitlab/project/milestone-time-check', opts).then(function (res) {
=======
        fetch('http://10.10.156.64:11000/gitlab/project/milestone-time-check', opts).then(function (res) {
            console.log('res',res.json());
            if(res.json() == 'success'){
                console.log('111')
            }
>>>>>>> devops-dev/master
            if(res.result){
                callback();
            }else{
                callback([new Error('日期超出允许修改范围')]);
            }
        }).catch(function (error) {});*/
    }
    test(date){
        const value = date;
        return value;
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
               /* { validator: this.checkDuedate.bind(this) }*/
            ],
        });

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        const updateLoading = this.props.updateLoading?true:false;
        return(
            <Box title={editType == 'add' ? '创建里程碑' : '修改里程碑'}>
                <Spin spinning={updateLoading} tip="正在保存数据,请稍候..." >
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                        <FormItem   {...formItemLayout} label="名称">
                            <Input {...titleProps} placeholder="请输入里程碑名称" />
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述" >
                            <Input type="textarea" rows="5" placeholder="请输入里程碑描述信息" {...getFieldProps('description')} />
                        </FormItem>
                        <FormItem  {...formItemLayout} label="计划完成时间">
                            <DatePicker size="large"  placeholder="计划完成时间"  onChange={this.test.bind(this) } {...dueDateProps}/>
                        </FormItem>
                        {editType == 'update' ?
                            <FormItem  {...formItemLayout} label="修改原因">
                                <Input  type="textarea" rows="5"
                                        {...getFieldProps('reason',{rules: [ { required: true, message:'请输入项目集合的修改原因' }]} )}
                                        placeholder="请输入里程碑的修改原因 " />
                            </FormItem>:<div></div>}
                        <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading} disabled={this.props.disabled}>确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Spin>
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
        updateErrorMsg:state.updateMilestones.errorMsg,
        updateLoading: state.updateMilestones.loading,
        updateMsg: state.updateMilestones.result,
        checkDateResult: state.checkDueDate.result,
        checkDateloading: state.checkDueDate.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createMilestone: bindActionCreators(createMilestone, dispatch),
        checkDueDateAction: bindActionCreators(checkDueDate, dispatch),
        updateMilestoneAction: bindActionCreators(updateMilestone, dispatch),
        getProjectSetMilestones: bindActionCreators(getProjectSetMilestones, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(projectSetMilestonesEdit));