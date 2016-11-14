/**
 * Created by Administrator on 2016-11-09.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Modal, notification, Row, Col, Icon, Select} from 'antd';
import Box from '../../components/box';
import MoreUserGroup from '../../components/more-user-group';
import 'pubsub-js';
import {UpdateUser} from './actions/user-detail-action';
import {getUserInfo} from './actions/user-info-action';
import styles from './index.css';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class UserAddModify extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys=[];
        this.state={
            modalVisible:false,
            selectedUserGroup:null
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                //console.log("formData:",formData)
                //调修改成员信息接口
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
        const {selectedUserGroup, getUserInfo} = this.props;
        notification.success({
            message: message,
            description: '',
            duration: 2
        });
        //调展示成员接口
        getUserInfo(selectedUserGroup.id);
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
        const {selectedUserGroup} = this.props;
        const {setFieldsValue} = this.props.form;
        const {record} = this.props.location.state;
        if(selectedUserGroup){
            this.setState({
                selectedUserGroup:selectedUserGroup.id,
            })
            setFieldsValue({group_id:selectedUserGroup.name});
            setFieldsValue({name:record.name});
        }else{
            this.setState({
                selectedUserGroup:0,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const {updateResult, updateErrors} = nextProps;
         //修改返回信息
         if (this.props.updateResult != updateResult && updateResult) {
         this.insertCallback("修改成功");
         } else if (this.props.updateErrors != updateErrors && updateErrors) {
         this.errCallback("修改失败",updateErrors);
         }
    }

    clickMoreGroup(){
        this.setState({
            modalVisible:true,
        })
    }

    handleOk(node){
        this.setState({
            modalVisible:false,
            selectedUserGroup:node.id,
        })
        if(node){
            const {setFieldsValue} = this.props.form;
            setFieldsValue({group_id:node.name});
        }
    }

    cancelChoose(){
        this.setState({
            modalVisible:false,
        })
    }

    render() {
        const {getFieldProps} = this.props.form;
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
                {required:true, message:'请输入员工姓名！'},
            ]});
        const groupProps = getFieldProps('group_id',
            {rules:[
                {required:true, message:'请选择组织！'},
            ],initialValue: '0'});
        const modifyResultProps = getFieldProps('reason',
            {rules:[
                {required:true, message:'请输入修改原因！'}
            ]});

        return(
            <Box title="修改员工信息">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="员工姓名">
                        <Input type="text" {...nameProps} placeholder="请输入员工姓名"/>
                    </FormItem>
                </Form>
                <div>
                    <Row>
                        <Col span={16}>
                            <FormItem {...formItemLayout_1} label="所属组织">
                                <Input type="text" {...groupProps} disabled/>
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Icon type="share-alt" className={styles.more_group}
                                  onClick={this.clickMoreGroup.bind(this)}/>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="修改原因">
                        <Input type="textarea" {...modifyResultProps} rows={4} />
                    </FormItem>
                </div>
                <MoreUserGroup modalVisible={this.state.modalVisible}
                               loading={this.props.loadingTree}
                               nodesData={this.props.userTreeData}
                               handleOk={this.handleOk.bind(this)}
                               cancelChoose={this.cancelChoose.bind(this)}/>
                <FormItem wrapperCol={{span: 10, offset: 10}} style={{marginTop: 24}}>
                    <Button type="primary" htmlType="submit"
                            loading={this.props.updateLoading}
                            disabled={this.props.updateDisabled}>
                        确定</Button>
                    <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                </FormItem>
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
        loginInfo:state.login.profile,
        loadingTree : state.getUserRelationTree.loading,
        userTreeData: state.getUserRelationTree.userTreeData,
        selectedUserGroup: state.getSelectNode.selectedUserGroup,
        userInfoData:state.getUserInfo.userInfoData,
         updateResult:state.createUser.updateResult,
         updateErrors:state.createUser.updateErrors,
         updateLoading:state.createUser.updateLoading,
         updateDisabled:state.createUser.updateDisabled,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateUser:bindActionCreators(UpdateUser, dispatch),
        getUserInfo:bindActionCreators(getUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAddModify);