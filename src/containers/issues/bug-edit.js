/**
 * Created by helen on 2016/11/28.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Row,DatePicker,Col,Checkbox,Spin} from 'antd';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as home from '../home/actions/home-action';
import * as request from '../request/actions/request-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class EditBug extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentWillMount(){
        const {selectedRow} = this.props.location.state;
        // console.log(selectedRow);
        this.props.actions.getDeveloperInfo(selectedRow.sets_issue_id,'demand_developer','');
        if(selectedRow){
            const {setFieldsValue} = this.props.form;
            setFieldsValue({'planTime': moment(selectedRow.due_date,"YYYY-MM-DD")});//时间类型转换
            setFieldsValue({'demand': selectedRow.issue_name});
            setFieldsValue({'due_date': moment()});
            setFieldsValue({'requirePerson': selectedRow.assignee_developer_or_tester.id.toString()});
            setFieldsValue({'assignee_develop_id': selectedRow.assignee_developer_or_tester.id.toString()});
        }
    }

    componentWillReceiveProps(nextProps) {
        const {addRequestResult} = nextProps;
        if(this.props.addRequestResult != addRequestResult && addRequestResult){
            message.success('提交成功');
            this.props.home.getNotifyItems(this.props.loginInfo.userId);
            this.context.router.goBack();
        }
    }

    disabledDate(current) {
        return current && current.startOf('day') < moment().startOf('day')
    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo} = this.props;
        const {selectedRow} = this.props.location.state;
        var labels =[];
        if(selectedRow.labels&&selectedRow.labels.length>0){
            for(let j=0;j<selectedRow.labels.length;j++){
                labels.push(selectedRow.labels[j].id);
            }
        }
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.type='bug';
                data.author_id = loginInfo.userId;
                data.sm_id=selectedRow.milestone_id;
                data.labels=labels;
                data.parent_id = selectedRow.sets_issue_id;
                if(new Date(data.due_date).toLocaleDateString()!=new Date(data.planTime).toLocaleDateString()&&data.due_date>data.planTime){
                    message.error('Bug预期完成时间不能大于关联工单上线时间！',3);
                    return ;
                }
                if(data.adviceOrderDuty_person){
                    data.adviceOrderDuty_person=0;
                }else{
                    data.adviceOrderDuty_person=1;
                }
                if(data.repairFlg){
                    data.repairFlg=0;
                }else{
                    data.repairFlg=1;
                }
                // console.log('收到表单值：', data);
                actions.addRequest(data);
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
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };

        const pending = this.props.developerLoading?true:false;
        const developer = this.props.developerInfo?this.props.developerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return (
            <Spin spinning={pending}>
                <Box title="新增Bug">
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <Row gutter={6}>
                            <Col sm={16}>
                        <FormItem labelCol ={{span:4}} wrapperCol={{ span: 18}}  label="标题" >
                            {getFieldDecorator('title',{rules:[{ required:true,message:'不能为空'}]})(<Input/>)}
                        </FormItem>
                                </Col>
                            <Col sm={8}>
                                <FormItem {...formItemLayout} label="紧急程度" >
                                    {getFieldDecorator('urgentDegree',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select style={{ width: 200 }} >
                                            <Option value="致命">致命</Option>
                                            <Option value="高">高</Option>
                                            <Option value="中">中</Option>
                                            <Option value="低">低</Option>
                                        </Select>)}
                                </FormItem>
                                </Col>
                            </Row>
                        <Row gutter={6}>
                            <Col sm={8}>
                                <FormItem {...formItemLayout} label="缺陷渠道" >
                                    {getFieldDecorator('ditch',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select style={{ width: 200 }} >
                                            <Option value="开发">开发</Option>
                                            <Option value="测试">测试</Option>
                                        </Select>)}
                                </FormItem>

                                <FormItem {...formItemLayout} label="预期完成时间" >
                                    {getFieldDecorator('due_date',{rules:[{ required:true,type:'object',message:'不能为空'}]})(<DatePicker disabled disabledDate={this.disabledDate.bind(this)} style={{ width: 200 }}  />)}
                                </FormItem>

                                <FormItem {...formItemLayout} label="类型" >
                                    {getFieldDecorator('bugType',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select style={{ width: 200 }} >
                                            <Option value="需求变化">需求变化</Option>
                                            <Option value="需求不明确">需求不明确</Option>
                                            <Option value="代码变更单不规范">代码变更单不规范</Option>
                                            <Option value="代码漏提交">代码漏提交</Option>
                                            <Option value="编译报错">编译报错</Option>
                                            <Option value="业务逻辑实现问题">业务逻辑实现问题</Option>
                                            <Option value="功能点或规则未实现">功能点或规则未实现</Option>
                                            <Option value="设计文档不合格">设计文档不合格</Option>
                                            <Option value="代码回退">代码回退</Option>
                                            <Option value="回归测试问题">回归测试问题</Option>
                                            <Option value="外部原因">外部原因</Option>
                                        </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="定位人员" >
                                    {getFieldDecorator('requirePerson',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select  showSearch
                                                 showArrow={false}
                                                 optionFilterProp="children"
                                                 notFoundContent="无法找到"
                                                 style={{ width: 200 }} >
                                            {developer}
                                        </Select>)}
                                </FormItem>
                                </Col>
                            <Col sm={8}>
                                <FormItem {...formItemLayout} label="关联的需求" >
                                    {getFieldDecorator('demand',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Input disabled style={{ width: 200 }}/>)}
                                </FormItem>

                                <FormItem {...formItemLayout} label="缺陷属性" >
                                    {getFieldDecorator('bugAttribute',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select style={{ width: 200 }} >
                                            <Option value="深层次">深层次</Option>
                                            <Option value="浅层次">浅层次</Option>
                                        </Select>)}
                                </FormItem>

                                <FormItem {...formItemLayout} label="所属模块" >
                                    {getFieldDecorator('module',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select style={{ width: 200 }} >
                                            <Option value="CRM">CRM</Option>
                                            <Option value="BOSS">BOSS</Option>
                                            <Option value="项目">项目</Option>
                                        </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="处理人员" >
                                    {getFieldDecorator('assignee_develop_id',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select  showSearch
                                                 showArrow={false}
                                                 optionFilterProp="children"
                                                 notFoundContent="无法找到"
                                                 style={{ width: 200 }} >
                                            {developer}
                                        </Select>)}
                                </FormItem>
                            </Col>
                            <Col sm={8}>
                                <FormItem {...formItemLayout} label="关联工单上线时间点" >
                                    {getFieldDecorator('planTime',{rules:[{ required:true,type:'object',message:'不能为空'}]})(<DatePicker disabled style={{ width: 200 }}  />)}
                                </FormItem>

                                <FormItem {...formItemLayout} label="遗留问题" >
                                    {getFieldDecorator('historicalFlg',{rules:[{ required:true,message:'不能为空'}]})(
                                        <Select style={{ width: 200 }} >
                                            <Option value="0">历史遗留</Option>
                                            <Option value="1">无</Option>
                                            <Option value="2">设计遗漏</Option>
                                        </Select>)}
                                </FormItem>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator('adviceOrderDuty_person')(
                                        <Checkbox>通知工单负责人</Checkbox>
                                    )}
                                </FormItem>

                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator('repairFlg')(
                                        <Checkbox>是否为以前缺陷修复操作引起的缺陷</Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            </Row>
                        <Row gutter={6}>
                            <Col sm={16}>
                        <FormItem labelCol ={{span:4}} wrapperCol={{ span: 18}} label="描述" >
                            {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" rows="5" />)}
                        </FormItem>
                            </Col>
                        </Row>
                        <FormItem wrapperCol={{ span: 16, offset: 8 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" loading={this.props.addRequestLoading}>提交</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>
            </Spin>
        );
    }
}

EditBug.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


EditBug = Form.create()(EditBug);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        developerLoading:state.request.getDeveloperLoading,
        developerInfo:state.request.developer,
        loginInfo:state.login.profile,
        addRequestResult: state.request.addRequestResult,
        addRequestLoading: state.request.addRequestLoading,
    };
}

function mapDispatchToProps(dispatch){
    return{
        home:bindActionCreators(home, dispatch),
        actions : bindActionCreators(request,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditBug);