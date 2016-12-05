
/**
 * Created by helen on 2016/11/22.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin} from 'antd';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as request from './actions/request-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class EditDemand extends Component{
    constructor(props){
        super(props);
        this.state = {};

    }

    componentWillMount(){
        const {actions,selectedProjectSet} = this.props;
        const {selectedRow} = this.props.location.state;
        if(selectedRow){
            const {setFieldsValue} = this.props.form;
            setFieldsValue(selectedRow);
        }
        if(!selectedProjectSet){
            notification.error({
                message: '未选择项目集',
                description:'请先先选择一个项目集！',
                duration: 2
            });
        }else{
            var id = selectedProjectSet.id.substr(0,selectedProjectSet.id.length-2);
            actions.getLabelInfo();
            actions.getDeveloperInfo(id,'set',30);
            actions.getTesterInfo(id,'set',20);
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

        const {loading,result,error} = nextProps;

        if (!loading && !error && result && result!=this.props.result) {
            message.success('提交成功！');
            this.context.router.goBack();
        }

    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo, selectedProjectSet} = this.props;

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.author_id = loginInfo.userId;
                data.type = 'demand';
                data.sid = selectedProjectSet.id.substr(0,selectedProjectSet.id.length-2);
                actions.editDemand(data);
            }
        })
    }

    disabledDate(current) {
        return current && current < moment();
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
        const {labelLoading,labelInfo,developerLoading,developerInfo,testerLoading,testerInfo} = this.props;
        const pending = labelLoading||developerLoading||testerLoading?true:false;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        const {editType} = this.props.location.state;

        const modifyReason = editType=='modify'?<FormItem {...formItemLayout}  label="需求修改原因" >
            {getFieldDecorator('reason',{rules:[{ required:true,message:'不能为空'}]})(<Input type="textarea" rows="5" />)}
        </FormItem>:'';

        const labels = labelInfo?labelInfo.map(data => <Option key={data.id}>{data.title}</Option>):[];

        const developer = developerInfo?developerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];

        const tester = testerInfo?testerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];


        return (
            <Spin spinning={pending}>
                <Box title={editType == 'add' ? '新增需求' : '修改需求'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout}  label="需求名称" >
                        {getFieldDecorator('title',{rules:[{ required:true,message:'不能为空'}]})(<Input placeholder="title"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="需求描述" >
                        {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="description" rows="5" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="业务范畴" >
                        {getFieldDecorator('lables',{rules:[{ required:true,type:'array',message:'不能为空'}]})(
                            <Select multiple
                                    style={{ width: 300 }} >
                                {labels}
                            </Select>)
                        }
                    </FormItem>

                    <FormItem {...formItemLayout} label="开发人员" >
                        {getFieldDecorator('assignee_develop_id',{rules:[{required:true, message:'不能为空'}]})(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择开发人员"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     style={{ width: 300 }}>
                                {developer}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="测试人员" >
                        {getFieldDecorator('assignee_test_id',{rules:[{required:true,message:'不能为空'}]})(
                            <Select  showSearch
                                     showArrow={false}
                                     placeholder="请选择对应的测试人员"
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     style={{ width: 300 }} >
                                {tester}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="计划完成时间" >
                        {getFieldDecorator('due_date',{rules:[{ required:true,type:'object',message:'不能为空'}]})(<DatePicker disabledDate={this.disabledDate.bind(this)} style={{ width: 300 }}  />)}
                    </FormItem>

                    {modifyReason}

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" loading={this.props.loading}>提交</Button>
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
        loginInfo:state.login.profile,
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
        loading:state.request.editDemandPending,
        result:state.request.editDemandResult,
        error:state.request.editDemandError,
        labelLoading:state.request.getLabelPending,
        labelInfo:state.request.label,
        developerLoading:state.request.getDeveloperPending,
        developerInfo:state.request.developer,
        testerLoading:state.request.getTesterPending,
        testerInfo:state.request.tester,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(request,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditDemand);