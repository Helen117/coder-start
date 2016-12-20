
/**
 * Created by helen on 2016/11/22.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin} from 'antd';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as home from '../home/actions/home-action';
import * as request from './actions/request-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class EditDemand extends Component{
    constructor(props){
        super(props);
        this.state = {
            developDirty: false
        };

    }

    componentWillMount(){
        const {actions,selectedProjectSet} = this.props;
        const {selectedRow} = this.props.location.state;
        if(selectedRow){
            const {setFieldsValue} = this.props.form;
            //console.log(selectedRow.expect_due_date,moment(selectedRow.expect_due_date))
            //this.getMilestone(moment(selectedRow.expect_due_date).valueOf());
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
            setFieldsValue({'labels':selectedRow.label_id.split(',')});
            setFieldsValue({'expect_due_date': moment(selectedRow.expect_due_date,"YYYY-MM-DD")});//时间类型转换
        }
        if(!selectedProjectSet){
            notification.error({
                message: '未选择项目集',
                description:'请先先选择一个项目集！',
                duration: 2
            });
        }else{
            var id = selectedProjectSet.selectedItemId;
            actions.getLabelInfo();
            actions.getDeveloperInfo(id,'set',30);
            actions.getTesterInfo(id,'set',20);
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

        const {editDemandResult, addDemandResult} = nextProps;
        if (this.props.editDemandResult != editDemandResult && editDemandResult ) {
            this.sucCallback('修改成功')
        }
        if(this.props.addDemandResult != addDemandResult && addDemandResult){
            this.sucCallback('新建成功')
        }
    }

    sucCallback(type){
        message.success(type);
        const {actions,selectedProjectSet} = this.props;
        actions.getDemandInfo(selectedProjectSet.selectedItemId);
        this.props.home.getNotifyItems(this.props.loginInfo.userId);
        this.context.router.goBack();
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo, selectedProjectSet} = this.props;

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const {selectedRow,editType} = this.props.location.state;
                const data = form.getFieldsValue();
                data.author_id = loginInfo.userId;
                data.type = 'demand';
                data.sid = selectedProjectSet.selectedItemId;
                data.files= this.state.fileList;
                if(editType == 'add'){
                    actions.addDemand(data);
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
                        && data.assignee_develop_id == selectedRow.assignee_develop_id && data.assignee_test_id == selectedRow.assign_test_id&&filesFlag) {
                        message.info('数据没有变更，不需提交', 2);
                    } else {
                        // console.log('接收的数据',data);
                        actions.editDemand(data);
                    }

                }

            }
        })
    }

    disabledDate(current) {
        return current && current < moment();
    }

    developTestDistinct(checkTarget,rule, value, callback){
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                if(value == checkTarget){
                    callback([new Error('测试与开发不能指定同一人')]);
                }else{
                    callback();
                }

            }, 500);
        }
    }

    handleChangeBlur(value) {
        this.setState({ developDirty: this.state.developDirty || !! value });
    }

    checkTest(rule, value, callback){

        const form = this.props.form;
        const id = form.getFieldValue('assignee_test_id');
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

    checkMatchMilestone(rule, value, callback){
        const currentMilestone = this.props.currentMilestone;
        console.log('currentMilestone',currentMilestone)
        if (currentMilestone && currentMilestone.length <= 0) {
            callback('未查询到匹配的里程碑');
        }else{
            callback();
        }
    }

    getMilestone(date,time){
        //console.log('date',date,time)
        const selectedProjectSet = this.props.selectedProjectSet;
        const sets_id = selectedProjectSet.selectedItemId;
        const due_date =date.valueOf()// new Date(parseInt(date).toLocaleDateString())
        this.props.actions.getCurrentMilestone(sets_id,due_date)
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

    beforeUpload(file){
        if (!(file.type === 'application/msword')) {
            message.error('上传的需求文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
            return false;
        }
        if(file.size/ 1024 / 1024 >10){
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
            // console.log(reader.result);
        }.bind(this);
        reader.readAsDataURL(file);
        return false;
    }

    render() {
        const {editType,selectedRow} = this.props.location.state;
        const { getFieldDecorator } = this.props.form;
        const {labelLoading,labelInfo,developerLoading,developerInfo,testerLoading,testerInfo,editDemandLoading,addDemandLoading,currentMilestone} = this.props;
        const pending = labelLoading||developerLoading||testerLoading?true:false;
        const buttonLoading = editDemandLoading||addDemandLoading ?true: false;
        const {disabledEditDeveloper,disabledEditTester} = this.disabledEditAssignee(selectedRow);
        let helpMsg = null, validateStatus="success";
        if(currentMilestone) {
            if(currentMilestone.length>0){
                validateStatus="success";
                helpMsg = '对应里程碑：'+currentMilestone[0].title +"，期望上线时间："+new Date(parseInt(currentMilestone[0].dueDate)).toLocaleDateString()
            }else{
                validateStatus="error";
                helpMsg = '尚未建立对应的里程碑'
            }
        }

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
                    <FormItem {...formItemLayout}  label="需求名称" >
                        {getFieldDecorator('title',{rules:[{ required:true,message:'不能为空'}]})(<Input placeholder="title"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="需求描述" >
                        {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="description" rows="5" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="业务范畴" >
                        {getFieldDecorator('labels',{rules:[{ required:true,type:'array',message:'不能为空'}]})(
                            <Select multiple
                                    style={{ width: 300 }} >
                                {labels}
                            </Select>)
                        }
                    </FormItem>

                    <FormItem {...formItemLayout} label="开发人员" >
                        {getFieldDecorator('assignee_develop_id',
                            {rules:[{required:true, message:'不能为空'},
                                { validator: this.checkDevelop.bind(this)}
                                ]})(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择开发人员"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     style={{ width: 300 }}
                                     disabled={disabledEditDeveloper}
                                     onChange={this.handleChangeBlur.bind(this)}>
                                {developer}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="测试人员" >
                        {getFieldDecorator('assignee_test_id',
                            {rules:[{required:true,message:'不能为空'},
                                { validator: this.checkTest.bind(this)}
                                ]})(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择对应的测试人员"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     disabled={disabledEditTester}
                                     style={{ width: 300 }}>
                                {tester}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="计划完成时间" help={helpMsg} validateStatus={validateStatus} >
                        {getFieldDecorator('expect_due_date',{rules:[{ required:true,type:'object',message:'不能为空'}]})
                        (<DatePicker disabledDate={this.disabledDate.bind(this)}
                                     onChange={this.getMilestone.bind(this)}
                                     style={{ width: 300 }}  />)}
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


EditDemand.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

EditDemand = Form.create()(EditDemand);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        selectedProjectSet: state.projectSet.selectedProjectSet,
        editDemandLoading: state.request.editDemandLoading,
        editDemandResult: state.request.editDemandResult,
        editDemandError: state.request.editDemandError,
        addDemandResult: state.request.addDemandResult,
        addDemandLoading: state.request.addDemandLoading,
        addDemandError: state.request.addDemandError,
        labelLoading: state.request.getLabelLoading,
        labelInfo: state.request.label,
        developerLoading: state.request.getDeveloperLoading,
        developerInfo: state.request.developer,
        testerLoading: state.request.getTesterLoading,
        testerInfo: state.request.tester,
        currentMilestone: state.request.currentMilestone,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions: bindActionCreators(request,dispatch),
        home:bindActionCreators(home, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditDemand);