import React,{ PropTypes } from 'react';
import InputPage from '../../components/input-page';
import { DatePicker, Button, Modal, Form, Input, Col,notification} from 'antd';
import Box from '../../components/box';
import {createMilestone} from './actions/create-milestones-actions';
import {getMilestones} from './actions/milestones-action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class MilestoneCreate extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.getProjectInfo) {
            const projectId = this.props.getProjectInfo.gitlabProject.id;
            this.props.getMilestones(projectId, 1, []);
        } else {
            const {router} = this.context;
            router.goBack();
            this.errChoosePro();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage } = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }

    }

    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '创建成功',
            duration: 2
        });
        this.context.router.goBack();
    }

    errCallback(errMessage){
        notification.error({
            message: '创建失败',
            description: errMessage,
            duration: 2
        });
    }

    errChoosePro(){
        notification.error({
            message: '未选择项目',
            description:'请先在左侧项目树中选择一个项目！',
            duration: 2
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form,logInfo } = this.props;

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                console.log('formData',formData);

                const due_date2 = new Date(due_date).toLocaleDateString()

                console.log('date',Date.parse(formData.due_date))
                console.log('date int',due_date);
                console.log('data fromate',due_date2);
                const projectId = this.props.getProjectInfo.gitlabProject.id;
                var gitlabMilestone = formData;
                gitlabMilestone.project_id= projectId;
                var userId = logInfo.userId;
                var owner = logInfo.username;
                var milestoneData = {owner,userId,gitlabMilestone};
                this.props.createMilestone(milestoneData);
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
        let lastMilestoneDuedate = null;
        if(milestones){
            if(milestones.length>0){
                let lastMilestoneDuedate = milestones[0].gitlabMilestone.due_date;
                lastMilestoneDuedate = lastMilestoneDuedate+(1 * 24 * 60 * 60 * 1000);
                lastMilestoneDuedate = new Date(lastMilestoneDuedate).toLocaleDateString();
                console.log('lastMilestoneDuedate',lastMilestoneDuedate);
                value = Date.parse(value);
                value = new Date(value).toLocaleDateString();
                console.log('value',value);
                console.log(value < lastMilestoneDuedate);
                if (!value ) {
                    callback();
                } else if(value) {
                    setTimeout(() => {
                        if (value < lastMilestoneDuedate) {
                            callback([new Error('时间需迟于上一里程碑的计划完成时间: '+new Date(milestones[0].gitlabMilestone.due_date).toLocaleDateString())]);
                        }else {
                            callback();
                        }
                    }, 500);
                }
            }
        }

    }

    render(){
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
            <Box title="创建里程碑">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                    <FormItem   {...formItemLayout} label="里程碑名称">
                        <Input {...titleProps} placeholder="请输入里程碑名称" />
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述" >
                        <Input type="textarea" placeholder="请输入里程碑描述信息" {...getFieldProps('description')} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="计划完成时间">
                            <DatePicker placeholder="计划完成时间" {...dueDateProps}/>
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

MilestoneCreate.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};



function mapStateToProps(state) {
    return {
        getProjectInfo: state.getProjectInfo.projectInfo,
        milestones: state.milestones.timeLineData,
        logInfo: state.login.profile,
        inserted: state.createMilestones.items,
        errMessage: state.createMilestones.errors,
        loading:state.createMilestones.loading,
        disabled:state.createMilestones.disabled,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        createMilestone: bindActionCreators(createMilestone, dispatch),
        getMilestones: bindActionCreators(getMilestones, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(MilestoneCreate));