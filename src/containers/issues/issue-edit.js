/**
 * Created by helen on 2016/9/19.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Upload,DatePicker,Icon} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class AddIssue extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentWillMount() {
        const {actions} = this.props;
        actions.fetchDataSource(1);
    }

    // componentDidMount(){
    //     const { actions } = this.props;
    //     actions.fetchUser(1);
    //     actions.fetchMileStone(2);
    // }

    componentWillReceiveProps(nextProps) {
        const result = nextProps.issue.addIssue;
        const error = nextProps.issue.addIssueError;

        if(error){
            message.error('新增失败');
        }
        if (!error && result) {
            message.success('新增成功');
        }

    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions,form } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                console.log('收到表单值：', data);
                actions.addIssues(1);
            }
        })
    }

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }
    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const { issue } = this.props;
        const options =issue&&issue.members?issue.members.map(data => <Option key={data.name}>{data.userName}</Option>):[];
        console.log(options);

        const mileStoneOptions =issue&&issue.mileStones?issue.mileStones.map(data => <Option key={data.id}>{data.title}</Option>):[];

        return (
            <Form horizontal onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout}  label="问题名称" >
                    <Input placeholder="title" {...getFieldProps('title',{rules:[{ required:true,message:'问题名称不能为空'}]})} />
                </FormItem>
                <FormItem {...formItemLayout} label="问题描述" >
                    <Input type="textarea" placeholder="description" rows="5" {...getFieldProps('description',{rules:[{required:true,message:'不能为空'}]})} />
                </FormItem>

                <FormItem {...formItemLayout} label="日期" >
                    <RangePicker style={{ width: 184 }} {...getFieldProps('data')} />
                </FormItem>

                <FormItem {...formItemLayout} label="指派给" >
                    <Select id="solver" size="large"  style={{ width: 200 }} {...getFieldProps('solver',{rules:[{required:true,message:'请选择指派的人'}]})} >
                        {options}
                    </Select>
                </FormItem>
                <FormItem {...formItemLayout} label="里程碑" >
                    <Select id="milestone" size="large"  style={{ width: 200 }} {...getFieldProps('milestone')} >
                        {mileStoneOptions}
                    </Select>
                </FormItem>

                <FormItem {...formItemLayout}  label="上传" >
                    <Upload {...getFieldProps('attachment')}>
                        <Button type="ghost">
                            <Icon type="upload" /> 点击上传
                        </Button>
                    </Upload>
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                </FormItem>
            </Form>
        );
    }
}

AddIssue.contextTypes = {
    router: PropTypes.object.isRequired
};


AddIssue = Form.create()(AddIssue);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        issue:state.issue
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddIssue);