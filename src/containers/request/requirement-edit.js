
/**
 * Created by helen on 2016/11/22.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin,Row, Col} from 'antd';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as home from '../home/actions/home-action';
import * as request from './actions/request-action';
import fetchData from '../../utils/fetch'

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class EditRequest extends Component{
    constructor(props){
        super(props);
        this.state = {
            developDirty: false,
            helpMsg: ''
        };

    }

    componentWillMount(){
        const {actions,selectedProjectSet} = this.props;
        const {selectedRow} = this.props.location.state;
        if(selectedRow){
            const {setFieldsValue} = this.props.form;
            if(selectedRow.files&&selectedRow.files.length>0){
                this.setState({fileList:[{
                    uid: -1,
                    name: selectedRow.files[0],
                    status: 'done',
                    url: ''
                }]
                });
            }
            setFieldsValue(selectedRow);
            setFieldsValue({'assignee_develop_id':selectedRow.assignee_develop_id.toString()});
            setFieldsValue({'assignee_test_id':selectedRow.assignee_test_id.toString()});
            //console.log('selectedRow.label_id',selectedRow.label_id)
            setFieldsValue({'labels':selectedRow.label_id.split(',')});
            setFieldsValue({'expect_due_date': moment(selectedRow.expect_due_date,"YYYY-MM-DD")});//时间类型转换
        }
        if(selectedProjectSet){
            var id = selectedProjectSet.selectedItemId;
            actions.getLabelInfo();
            actions.getDeveloperInfo(id,'set',30);
            actions.getTesterInfo(id,'set',20);
        }
    }


    componentWillReceiveProps(nextProps) {
        const actions = this.props.actions;
        const {editRequestResult, addRequestResult} = nextProps;
        if (this.props.editRequestResult != editRequestResult && editRequestResult ) {
            actions.getRequestInfo(this.props.page, this.props.condition);
            this.sucCallback('修改成功')
        }

        if(this.props.addRequestResult != addRequestResult && addRequestResult){
            const queryCondition = {sets_id: this.props.selectedProjectSet.selectedItemId}
            actions.requestQueryCondition(1, queryCondition);
            actions.getRequestInfo(1, queryCondition);
            this.sucCallback('新建成功')
        }
    }

    sucCallback(type){
        message.success(type);
        this.props.home.getNotifyItems(this.props.loginInfo.userId);
        this.context.router.goBack();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo, selectedProjectSet} = this.props;
        form.validateFieldsAndScroll((errors) => {
            if (!!errors) {
                return;
            } else {
                const {selectedRow,editType} = this.props.location.state;
                const data = form.getFieldsValue();
                data.expect_due_date = data.expect_due_date.valueOf();
                data.author_id = loginInfo.userId;
                data.sid = selectedProjectSet.selectedItemId;
                data.files= this.state.fileList;
                if(editType == 'add'){
                    actions.addRequest(data);
                }else{
                    data.id = selectedRow.id;
                    data.files= this.state.fileList&&selectedRow.files&&this.state.fileList[0].name==selectedRow.files[0]?[]:this.state.fileList;
                    data.expect_due_date = data.expect_due_date.valueOf();
                    var labels = data.labels && data.labels.length > 0 ? data.labels + '' : '';
                    var filesFlag = false;
                    if(!data.files||data.files.length==0){
                        filesFlag = true;
                    }
                    if (data.title == selectedRow.title && data.description == selectedRow.description &&labels==selectedRow.label_id&& new Date(parseInt(data.expect_due_date)).toLocaleDateString() == selectedRow.expect_due_date
                        && data.assignee_develop_id == selectedRow.assignee_develop_id && data.assignee_test_id == selectedRow.assignee_test_id&&filesFlag && data.type == selectedRow.type) {
                        message.info('数据没有变更，不需提交', 2);
                    } else {
                        actions.editRequest(data);
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
                //do nothing
            }
        })
    }

    disabledDate(current) {
        return current && current.startOf('day') < moment().startOf('day')
    }

    getAssigneeWorkload(value,type){
        const formData = this.props.form.getFieldsValue();
        if(formData.expect_due_date && value && type=='developer'){
            this.props.actions.getDeveloperWorkload(value,formData.expect_due_date.valueOf());
        }
        else if(formData.expect_due_date && value && type=='tester'){
            this.props.actions.getTesterWorkload(value,formData.expect_due_date.valueOf());
        }
    }

    getWorkloadByDate(value){
        const formData = this.props.form.getFieldsValue();
        if(formData.assignee_develop_id && value ){
            this.props.actions.getDeveloperWorkload(formData.assignee_develop_id,value.valueOf());
        }
        if(formData.assignee_test_id && value ){
            this.props.actions.getTesterWorkload(formData.assignee_test_id,value.valueOf());
        }
    }

    changeDeveloper(value) {
        this.setState({ developDirty: this.state.developDirty || !! value });
        this.getAssigneeWorkload(value,'developer');
    }

    changeTester(value){
        this.getAssigneeWorkload(value,'tester');
    }

    checkTest(rule, value, callback){
        const form = this.props.form;
        if (value && value == form.getFieldValue('assignee_develop_id')) {
            callback('开发和测试不能指定同一人');
        } else {
            callback();
        }

    }

    checkDevelop(rule, value, callback){
        const form = this.props.form;
        if (value && this.state.developDirty) {
            form.validateFields(['assignee_test_id'], { force: true });
        }
        callback();
    }

    disabledEditAssignee(selectedRow){
        let disabledEditTester=false,disabledEditDeveloper=false;
        if(selectedRow){
            if(selectedRow.developer_confirm_date){
                disabledEditDeveloper=true;
            }
            if(selectedRow.tester_confirm_date){
                disabledEditTester=true;
            }
        }
        return {disabledEditDeveloper,disabledEditTester}
    }

    checkDuedate(rule, value, callback){
        if(value){
            const selectedProjectSet = this.props.selectedProjectSet;
            const sets_id = selectedProjectSet.selectedItemId;
            const due_date =value.valueOf();
            this.getWorkloadByDate(value);
            const path = '/project/current-milestone'
            const params = {sets_id:sets_id, due_date:due_date}
            fetchData(path, params,callback,this.handleCheckDuedateResult.bind(this))
        }else{
            callback();
        }
    }

    handleCheckDuedateResult(result,callback){
        if(!result.result && !result.milestones){
            callback('尚未建立对应的里程碑')
        }else if(!result.result && result.milestones){
            callback('里程碑：'+result.milestones.title +"，期望上线时间："+new Date(parseInt(result.milestones.dueDate)).toLocaleDateString()+'，结束前两天禁止创建需求，请调整计划完成时间')
        }else if(result.result && result.milestones){
            this.setState({
                helpMsg : '对应里程碑：'+result.milestones.title +"，期望上线时间："+new Date(parseInt(result.milestones.dueDate)).toLocaleDateString()
            })
            callback();
        }else{
            callback();
        }
    }

    beforeUpload(file){
        var len = file.name.length;
        if (!(file.name.substr(len-4,4).toLowerCase() == '.doc')) {
            message.error('上传的需求文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
            return false;
        }
        if(file.size/ 1024 / 1024 >10){
            message.error('文件大小不能超过10M',3);
            return false;
        }

        if(file.size==0){
            message.error('不能上传空文件',3);
            return false;
        }

        const reader = new FileReader();
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
        return false;
    }


    render() {
        const {editType,selectedRow} = this.props.location.state;
        const { getFieldDecorator,getFieldError } = this.props.form;
        const {labelLoading,labelInfo,developerLoading,developerInfo,testerLoading,testerInfo,editRequestLoading,addRequestLoading} = this.props;
        const pending = labelLoading||developerLoading||testerLoading?true:false;
        const buttonLoading = editRequestLoading||addRequestLoading ?true: false;
        const {disabledEditDeveloper,disabledEditTester} = this.disabledEditAssignee(selectedRow);

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        const modifyReason = editType=='modify'?<FormItem {...formItemLayout}  label="需求修改原因" >
            {getFieldDecorator('reason',{rules:[{ required:true,message:'请填写修改原因'}]})(<Input type="textarea" rows="5" />)}
        </FormItem>:'';
        const labels = labelInfo?labelInfo.map(data => <Option key={data.id}>{data.title}</Option>):[];
        const developer = developerInfo?developerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const tester = testerInfo?testerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return (
            <Spin spinning={pending} >
                <Box title={editType == 'add' ? '新增需求' : '修改需求'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="类型" >
                        {getFieldDecorator('type',
                            {rules:[{required:true, message:'请选择需求类型'}], initialValue:'demand'})(
                            <Select  showSearch
                                     showArrow={false}
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     style={{ width: 300 }}
                                     disabled={disabledEditDeveloper}>
                                <Option key='demand'>需求</Option>
                                <Option key='defect'>缺陷</Option>
                            </Select>)}
                    </FormItem>
                    <FormItem {...formItemLayout}  label="需求主题" >
                        {getFieldDecorator('title',{rules:[{ required:true,message:'请填写需求主题'}]})(<Input placeholder="请填写需求主题"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="需求描述" >
                        {getFieldDecorator('description',{rules:[{required:true,message:'请填写需求描述'}]})(<Input type="textarea" placeholder="请填写需求描述" rows="5" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="计划完成时间" help={getFieldError('expect_due_date')?getFieldError('expect_due_date'):this.state.helpMsg} >
                        {getFieldDecorator('expect_due_date',
                            {rules:[{ required:true,type:'object',message:'请选择计划完成时间'},
                            { validator: this.checkDuedate.bind(this)}]})(<DatePicker allowClear={false}
                                     disabledDate={this.disabledDate.bind(this)}
                                     style={{ width: 300 }}  />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="开发人员" help={getFieldError('assignee_develop_id')?getFieldError('assignee_develop_id'):this.props.developerWorkloder?'该员工在此阶段有待办任务'+this.props.developerWorkloder.taskNum+'项':''}>
                        {getFieldDecorator('assignee_develop_id',
                            {rules:[{required:true, message:'请选择开发人员'},
                                { validator: this.checkDevelop.bind(this)}
                                ]})(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择开发人员"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     style={{ width: 300 }}
                                     disabled={disabledEditDeveloper}
                                     onChange={this.changeDeveloper.bind(this)}>
                                {developer}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="测试人员" help={getFieldError('assignee_test_id')?getFieldError('assignee_test_id'):this.props.testerWorkloader?'该员工在此阶段有待办任务'+this.props.testerWorkloader.taskNum+'项':''}>
                        {getFieldDecorator('assignee_test_id',
                            {rules:[{required:true,message:'请选择测试人员'},
                                { validator: this.checkTest.bind(this)}
                                ]})(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择测试人员"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     disabled={disabledEditTester}
                                     style={{ width: 300 }}
                                     onChange={this.changeTester.bind(this)}>
                                {tester}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="业务范畴" >
                        {getFieldDecorator('labels',{rules:[{ required:true,type:'array',message:'请选择业务范畴'}]})(
                            <Select multiple
                                    optionFilterProp="children"
                                    style={{ width: 300 }} >
                                {labels}
                            </Select>)
                        }
                    </FormItem>

                    <FormItem {...formItemLayout}  label="文档上传" >
                        {getFieldDecorator('files')(
                            <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>)}
                    </FormItem>

                    {modifyReason}

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" loading={buttonLoading}>提交</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
            </Spin>
        );
    }

}


EditRequest.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

EditRequest = Form.create()(EditRequest);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        editRequestLoading: state.request.editRequestLoading,
        editRequestResult: state.request.editRequestResult,
        addRequestResult: state.request.addRequestResult,
        addRequestLoading: state.request.addRequestLoading,
        labelLoading: state.request.getLabelLoading,
        labelInfo: state.request.label,
        developerLoading: state.request.getDeveloperLoading,
        developerInfo: state.request.developer,
        testerLoading: state.request.getTesterLoading,
        testerInfo: state.request.tester,
        developerWorkloder: state.request.developerWorkloder,
        testerWorkloader: state.request.testerWorkloader,
        condition: state.request.queryCondition,
        page: state.request.page,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions: bindActionCreators(request,dispatch),
        home:bindActionCreators(home, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditRequest);