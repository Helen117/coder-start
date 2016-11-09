/**
 * Created by Administrator on 2016-11-09.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification} from 'antd';
import Box from '../../components/box';
import 'pubsub-js';

const FormItem = Form.Item;

class UserAddModify extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            reveiveGroup:null,
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form } = this.props;
        const {editType} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                if(editType == 'add'){
                    //调创建组织的接口
                }else{
                    //调修改组织的接口
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

    insertCallback(message){
        notification.success({
            message: message,
            description: '',
            duration: 2
        });
        //调展示成员接口
        this.context.router.goBack();
    }

    errCallback(message,errmessage){
        notification.error({
            message: message,
            description:errmessage,
            duration: 4
        });
    }

    componentWillMount() {
        /*const {selectedRow} = this.props.location.state;
         if (selectedRow){
         const {setFieldsValue} = this.props.form;
         setFieldsValue({name:selectedRow.name});
         setFieldsValue({description:selectedRow.description});
         setFieldsValue({visibility_level:selectedRow.visibility_level.toString()});
         }*/
    }

    componentWillReceiveProps(nextProps) {
        /*const {result, errMessage, updateResult, updateErrors} = nextProps;
         //创建返回信息
         if (this.props.result != result && result) {
         this.insertCallback("创建成功");
         } else if (this.props.errMessage != errMessage && errMessage) {
         this.errCallback("创建失败",errMessage);
         }
         //修改返回信息
         if (this.props.updateResult != updateResult && updateResult) {
         this.insertCallback("修改成功");
         } else if (this.props.updateErrors != updateErrors && updateErrors) {
         this.errCallback("修改失败",updateErrors);
         }*/
    }

    render() {
        const {editType} = this.props.location.state;
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const nameProps = getFieldProps('name',
            {rules:[
                {required:true, message:'请输入员工名称！'},
            ]});
        const modifyResultProps = getFieldProps('modify_result',
            {rules:[
                {required:editType == 'add'?false:true, message:'请输入修改原因！'}
            ]});

        return(
            <Box title={editType == 'add' ? '新增人员' : '修改人员'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="员工姓名">
                        <Input type="text" {...nameProps} placeholder="请输入员工姓名"/>
                    </FormItem>
                    {editType == 'add' ? (<div></div>) : (
                        <FormItem {...formItemLayout} label="修改原因">
                            <Input type="textarea" {...modifyResultProps} rows={4} />
                        </FormItem>
                    )}
                    <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit"
                        >
                            确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
        )
    }
}

UserAddModify.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UserAddModify = Form.create()(UserAddModify);

function mapStateToProps(state) {
    return {
        /*result: state.createUserGroup.result,
         errMessage:state.createUserGroup.errors,
         loading:state.createUserGroup.loading,
         disabled:state.createUserGroup.disabled,
         updateResult:state.createUserGroup.updateResult,
         updateErrors:state.createUserGroup.updateErrors,
         updateLoading:state.createUserGroup.updateLoading,
         updateDisabled:state.createUserGroup.updateDisabled,*/
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAddModify);