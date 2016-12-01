/**
 * Created by helen on 2016/12/1.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Box from '../../components/box';
import * as label from './actions/label-action';

const FormItem = Form.Item;

class LabelEdit extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){
        const {selectedRow} = this.props.location.state;
        if(selectedRow){
            const {setFieldsValue} = this.props.form;
            setFieldsValue(selectedRow);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {loading,editLabel} = nextProps;

        if (!loading && editLabel) {
            message.success('新增成功');
            this.context.router.goBack();
        }

    }

    handleSubmit(e) {
        e.preventDefault();
        const {actions, form, loginInfo} = this.props;
        // const {editType, selectedRow} = this.props.location.state;

        form.validateFields( (errors, values) => {
            if (!!errors) {
                //message.error(errors,2);
                return;
            } else {
                const data = form.getFieldsValue();
                data.username = loginInfo.username;
                actions.editLabel(data);
                // console.log('收到表单值：', data);
            }
        })
    }

    handleCancel() {
        const {form} = this.props;
        const {router} = this.context;
        router.goBack();
        form.resetFields();
    }

    render() {
        const {editType} = this.props.location.state;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };

        return (
                <Box title={editType == 'add' ? '新增Label' : '修改Label'}>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout}  label="标题" >
                            {getFieldDecorator('title',{rules:[{ required:true,message:'不能为空'}]})(<Input placeholder="title"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述" >
                            {getFieldDecorator('description',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="description" rows="5" />)}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading}>提交</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Box>
        );
    }
}

LabelEdit.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


LabelEdit = Form.create()(LabelEdit);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        loading:state.label.pending,
        editLabel:state.label.editLabel,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(label,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(LabelEdit);