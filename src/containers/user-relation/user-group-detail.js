/**
 * Created by Administrator on 2016-11-08.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification, Icon, Row, Col} from 'antd';
import Box from '../../components/box';
import TreeFilter from '../../components/tree-filter';
import 'pubsub-js';
import styles from './index.css';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class UserGroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            modalVisible:false
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
        PubSub.publish("evtRefreshUserGroupTree",{});
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

    clickMoreGroup(){
        this.setState({
            modalVisible:true,
        })
    }

    handleOk(){}

    cancelChoose(){
        this.setState({
            modalVisible:false,
        })
    }

    onSelectNode(){

    }

    render() {
        const {editType} = this.props.location.state;
        const {getFieldProps} = this.props.form;
        const {userTreeData, loading} = this.props;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 8},
        };
        const formItemLayout_1 = {
            labelCol: {span: 12},
            wrapperCol: {span: 12},
        };
        const nameProps = getFieldProps('name',
            {rules:[
                {required:true, message:'请输入项目组名称！'},
            ]});
        const modifyResultProps = getFieldProps('modify_result',
            {rules:[
                {required:editType == 'add'?false:true, message:'请输入修改原因！'}
            ]});
        const parentGroupProps = getFieldProps('parent_group',{initialValue: '-1'},
            {rules:[
                {required:true, message:'请输入项目组名称！'},
            ]});

        return(
            <Box title={editType == 'add' ? '新建组织' : '修改组织'}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="组织名称">
                        <Input type="text" {...nameProps} placeholder="请输入组织名称"/>
                    </FormItem>
                    <Row>
                        <Col span={16}>
                            <FormItem {...formItemLayout_1} label="父组织名称">
                                <Input type="text" {...parentGroupProps} disabled/>
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Icon type="share-alt" className={styles.more_group}
                                onClick={this.clickMoreGroup.bind(this)}/>
                        </Col>
                    </Row>
                    {editType == 'add' ? (<div></div>) : (
                        <FormItem {...formItemLayout} label="修改原因">
                            <Input type="textarea" {...modifyResultProps} rows={4} />
                        </FormItem>
                    )}
                    <Modal title="组织选择"
                           visible={this.state.modalVisible}
                           onOk={this.handleOk.bind(this)}
                           onCancel={this.cancelChoose.bind(this)}
                    >
                        <TreeFilter
                            loading={loading}
                            notFoundMsg='找不到项目'
                            inputPlaceholder="快速查询项目"
                            loadingMsg="正在加载项目信息..."
                            nodesData={userTreeData}
                            onSelect={this.onSelectNode.bind(this)}/>
                    </Modal>
                    <FormItem wrapperCol={{span: 10, offset: 10}} style={{marginTop: 24}}>
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

UserGroupDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UserGroupDetail = Form.create()(UserGroupDetail);

function mapStateToProps(state) {
    return {
        loading : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
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

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupDetail);