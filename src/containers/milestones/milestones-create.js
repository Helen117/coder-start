/**
 * Created by zhaojp on 2016/9/19.
 */

import React,{ PropTypes } from 'react';
import InputPage from '../../components/input-page';
import { DatePicker, Button, Modal, Form, Input, Col,notification} from 'antd';
import Box from '../../components/box';
import {createMilestone} from './actions/create-milestones-actions';
import {getMoreMilestones} from './actions/more-milestones-actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class MilestoneCreate extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form,logInfo,milestones } = this.props;

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                var gitlabMilestone = formData;
                gitlabMilestone.project_id= 17;
                var userId = logInfo.userId;
                var owner = logInfo.username;
                var milestoneData = {owner,userId,gitlabMilestone};
                this.props.createMilestone(milestoneData);
            }
        })
    }


    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '',
            duration: 2
        });
        this.clearData();
        this.context.router.goBack();

    }

    clearData(){
        let data = [];
        this.props.getMoreMilestones(data);
    }

    errCallback(){
        notification.error({
            message: '创建失败',
            description: '创建失败!',
            duration: 2
        });
    }


    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage } = nextProps;
        if (this.props.result != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback();
        }
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

    titleExists(rule, value, callback){
        const {milestones} = this.props;
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                for( let i=0; i<milestones.length;i++){
                    if (value === milestones[i].gitlabMilestone.title) {
                        callback([new Error('里程碑已存在')]);
                    } else {
                        callback();
                    }}
            }, 800);
        }
    }

    dateFormate(date) {
        return new Date(parseInt(date)).toLocaleDateString();
    }

    //中国标准时间转换
    formatTen(num) {
        return num > 9 ? (num + "") : ("0" + num);
    }

    formatDate(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + "/" + this.formatTen(month) + "/" + this.formatTen(day);
    }

    checkCreateDate(rule, value, callback){
        const {milestones} = this.props;
        const lastMilestoneDuedate = milestones[0].gitlabMilestone.due_date;
        const lastDuedateFormate = this.dateFormate(lastMilestoneDuedate);

        if (!value) {
            callback();
        } else {
           setTimeout(() => {

                    if (this.formatDate(value) < lastDuedateFormate) {
                        callback([new Error('开始时间不能早于上一里程碑的结束时间:'+lastDuedateFormate)]);
                    }if (this.formatDate(value) > lastDuedateFormate) {
                        callback([new Error('上一里程碑的结束时间:'+lastDuedateFormate+',日程安排存在时间间隙')]);
                    } else {
                        callback();
                    }
            }, 800);
        }

    }

    disabledStartDate(startValue) {
        const { getFieldValue } = this.props.form;
        if (!startValue || !getFieldValue('due_date')) {
            return false;
        }
        return startValue.getTime() >= getFieldValue('due_date');
    }

    disabledEndDate(endValue) {
        const { getFieldValue } = this.props.form;
        if (!endValue || !getFieldValue('created_date')) {
            return false;
        }
        return endValue.getTime() <= getFieldValue('created_date');
    }

    render(){
        const {getFieldProps} = this.props.form;
        const titleProps = getFieldProps('title', {
            rules: [
                { required: true, message: '请填写里程碑名称' },
                {max: 30,message: '里程碑名称需在30字符以内'},
                { validator: this.titleExists.bind(this) },
            ],
        });

        const createDateProps = getFieldProps('created_date', {
            rules: [
                { required: true,
                    type: 'date',
                    message: '请选择开始日期', },
                { validator: this.checkCreateDate.bind(this) },
            ],
        });

        const dueDateProps = getFieldProps('due_date', {
            rules: [
                { required: true,
                    type: 'date',
                    message: '请选择结束日期', },
                //{ validator: this.checkCreateDate.bind(this) },
            ],
        });

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };


        return(
        <Box title="创建里程碑">
            <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                <FormItem   {...formItemLayout} label="名称">
                    <Input {...titleProps} placeholder="请输入名称" />
                </FormItem>
                <FormItem {...formItemLayout} label="备注" >
                    <Input type="textarea" placeholder="请输入描述信息" {...getFieldProps('description',{rules:[{ max: 100,message:'描述信息需在100个字符以内'}]})} />
                </FormItem>
                <FormItem
                    label="日期"
                    labelCol={{ span: 6 }}
                    required
                >
                    <Col span="4">
                        <FormItem>
                            <DatePicker
                                placeholder="开始日期"
                                {...createDateProps}
                                disabledDate={this.disabledStartDate.bind(this)}
                            />
                        </FormItem>
                    </Col>
                    <Col span="1">
                        <p className="ant-form-split" >-</p>
                    </Col>
                    <Col span="6">
                        <FormItem>
                            <DatePicker
                                placeholder="结束日期"
                                {...dueDateProps}
                                disabledDate={this.disabledEndDate.bind(this)}/>
                        </FormItem>
                    </Col>
                </FormItem>
                <FormItem wrapperCol={{span: 16, offset: 11}} style={{marginTop: 24}}>
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
        moreMilestoneData:state.moreMilestonesData.moreData,
        milestones: state.milestones.items,
        logInfo: state.login.profile,
        result: state.createMilestones.items,
        errMessage: state.createMilestones.errors,
        loading:state.createMilestones.loading,
        disabled:state.createMilestones.disabled,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        createMilestone: bindActionCreators(createMilestone, dispatch),
        getMoreMilestones:bindActionCreators(getMoreMilestones, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(MilestoneCreate));