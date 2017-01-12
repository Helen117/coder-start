import React,{ PropTypes } from 'react';
import { DatePicker, Button, Modal, Form, Input, Col,notification, message,Spin} from 'antd';
import Box from '../../components/box';
import {createMilestone,updateMilestone,getProjectSetMilestones} from './milestones-action';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetchData from '../../utils/fetch'

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ProjectSetMilestonesEdit extends React.Component {
    constructor(props) {
        super(props);
        this.groupId = this.props.selectedProjectSet?this.props.selectedProjectSet.id:'';
    }

    componentDidMount() {
        const item = this.props.location.state.item;
        if (item){
            item.description = item.description? item.description:"";
            let due_date = item.due_date;
            item.due_date = moment(item.due_date);
            this.props.form.setFieldsValue(item);
            item.due_date = due_date;
        }
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, updateMsg} = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback('创建成功');
        }
        if(this.props.updateMsg !=updateMsg && updateMsg){
            this.insertCallback('修改成功');
        }
    }

    insertCallback(type){
        message.success(type);
        const {date,mode} = this.props.location.state;
        this.props.getProjectSetMilestones(this.groupId,date,mode);
        this.context.router.push({
            pathname: "/ProjectSetTree/projectSetMilestones",
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form,logInfo } = this.props;
        const {editType,item} = this.props.location.state;
        form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                formData.set_id= this.groupId.substring(0,this.groupId.length-2);
                formData.author_id = logInfo.userId;
                formData.due_date = formData.due_date.valueOf();
                if(editType == 'add'){
                    this.props.createMilestone(formData);
                }else{
                   /* if(item.title==formData.title && item.description==formData.description &&
                        new Date(item.due_date).toLocaleDateString()==new Date(formData.due_date.format()).toLocaleDateString()){
                        message.error('没有改动,无需提交表单');

                    }else{*/
                        formData.id = this.props.location.state.item.id;
                        this.props.updateMilestoneAction(formData);
                    //}
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
        if(value){
            const item = this.props.location.state.item;
            const milestone_id = item? item.id: '';
            const sets_id = item? item.set_id: this.props.selectedProjectSet.selectedItemId;
            const due_date = new Date(value.valueOf()).toLocaleDateString();
            const path = '/project/milestone-time-check'
            const params = {milestone_id:milestone_id, sets_id:sets_id, due_date:due_date}
            fetchData(path, params,callback,this.handleCheckDuedateResult)
        }else{
            callback();
        }
    }

    handleCheckDuedateResult(result,callback){
        if(result){
            callback();
        }else{
            callback('计划完成时间超出允许设定范围');
        }
    }

    checkTitle(rule, value, callback){
        const item = this.props.location.state.item;
        const milestone_id = item? item.id: '';
        const path = '/project/milestone-title-ocp';
        const params = {title:value,milestone_id:milestone_id};
        fetchData(path,params,callback,this.handleCheckTitleResult);
    }

    handleCheckTitleResult(result,callback){
        if(result){
            callback();
        }else{
            callback('主题已被占用');
        }
    }


    disabledDate(current) {
        return current && current.startOf('day') < moment().startOf('day')
    }

    render(){
        const {editType} = this.props.location.state;
        const {getFieldDecorator} = this.props.form;
        const titleProps = getFieldDecorator('title', {
            rules: [
                { required: true, message:'请输入里程碑主题' },
                { max: 30, message: '主题长度为 1~30 个字符' },
                { validator: this.checkTitle.bind(this) }
            ],
        });

        const dueDateProps = getFieldDecorator('due_date', {
            rules: [
                { required: true, type: 'object', message: '请选择计划完成时间' },
                { validator: this.checkDuedate.bind(this) }
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
                        <FormItem   {...formItemLayout} label="主题">
                            {titleProps(<Input placeholder="请输入里程碑主题" /> )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="描述" >
                            {getFieldDecorator('description')
                            ( < Input type="textarea" rows="5" placeholder="请输入里程碑描述信息" />)}
                        </FormItem>

                        <FormItem  {...formItemLayout} label="计划完成时间">
                            {dueDateProps(<DatePicker size='large'
                                                      disabledDate={this.disabledDate.bind(this)}
                                                      placeholder="计划完成时间"
                                                      style={{width:300}} />)}
                        </FormItem>

                        {editType == 'update' ?
                            <FormItem  {...formItemLayout} label="修改原因">
                                {getFieldDecorator('result',{rules: [ { required: true, message:'请输入项目集合的修改原因' }]})
                                (<Input type="textarea" rows="5" placeholder="请输入里程碑的修改原因 " />)}
                            </FormItem>:<div></div>}

                        <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading} >确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </Box>

        );
    }
}

ProjectSetMilestonesEdit.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};



function mapStateToProps(state) {
    return {
        selectedProjectSet: state.projectSet.selectedProjectSet,
        logInfo: state.login.profile,
        inserted: state.milestones.createResult,
        loading:state.milestones.createLoading,
        updateLoading: state.milestones.updateLoading,
        updateMsg: state.milestones.updateResult,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createMilestone: bindActionCreators(createMilestone, dispatch),
        updateMilestoneAction: bindActionCreators(updateMilestone, dispatch),
        getProjectSetMilestones: bindActionCreators(getProjectSetMilestones, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(ProjectSetMilestonesEdit));