/**
 * Created by helen on 2016/11/22.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as request from './actions/request-action';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class NewRequest extends Component{
    constructor(props){
        super(props);
        this.state = {};

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo, selectedProjectSet} = this.props;
        if(!selectedProjectSet){
            message.error("请选择一个项目集",3);
        }

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.username = loginInfo.username;
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        return (
                <Box title="新增需求">
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout}  label="需求名称" >
                            {getFieldDecorator('title',{rules:[{ required:true,message:'不能为空'}]})(<Input placeholder="title"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="需求描述" >
                            {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="description" rows="5" />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="业务范畴" >
                            {getFieldDecorator('type')(
                                <Select id="type"  style={{ width: 300 }}>
                                    <Option value="demand">产品</Option>
                                    <Option value="defect">计费</Option>
                                    <Option value="bug" >接续</Option>
                                </Select>)
                            }
                        </FormItem>

                        <FormItem {...formItemLayout} label="开发人员" >
                            {getFieldDecorator('developer',{rules:[{ required:true,message:'不能为空'}]})(
                                <Select  showSearch
                                         showArrow={false}
                                         placeholder="请选择开发人员"
                                         optionFilterProp="children"
                                         notFoundContent="无法找到"
                                         style={{ width: 300 }}>
                                    <Option value="1">孙磊</Option>
                                    <Option value="2">张亚军</Option>
                                </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="测试人员" >
                            {getFieldDecorator('tester',{rules:[{ required:true,message:'不能为空'}]})(
                                <Select  showSearch
                                         showArrow={false}
                                         placeholder="请选择对应的测试人员"
                                         optionFilterProp="children"
                                         notFoundContent="无法找到"
                                         style={{ width: 300 }} >
                                    <Option value="1">孙磊</Option>
                                    <Option value="2">张军</Option>
                                </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="计划完成时间" >
                            {getFieldDecorator('due_date',{rules:[{ required:true,message:'不能为空'}]})(<DatePicker style={{ width: 300 }}  />)}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </Box>
        );
    }

}


NewRequest.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

NewRequest = Form.create()(NewRequest);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(request,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(NewRequest);