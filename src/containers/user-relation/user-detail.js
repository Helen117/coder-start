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
import styles from './index.css';
import TransferFilter from '../../components/transfer-filter';
import {getAllUserInfo} from './actions/user-info-action';
import {createUser,setUserDelete} from './actions/user-detail-action';
import {getUserInfo} from './actions/user-info-action';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class UserAddModify extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys=[];
        this.state={
            //modalVisible:false,
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form,createUser,loginInfo,selectedUserGroup,setUserDelete } = this.props;
        const {editType} = this.props.location.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                let data = {};
                data.creator_id = loginInfo.userId;
                data.group_id = selectedUserGroup.id;
                data.user_ids = this.targetKeys;
                if(editType == 'add'){
                    //调新增人员的接口
                    createUser(data)
                }else{
                    //调修改人员的接口
                    setUserDelete(data)
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
        const {allUserInfo} = this.props;
        if(allUserInfo.length == 0){
            this.props.getAllUserInfo();
        }
        /*const {selectedUserGroup} = this.props;
        const {editType,selectedRow} = this.props.location.state;
        const {setFieldsValue} = this.props.form;
        if(selectedUserGroup){
            if(editType == 'add'){
                setFieldsValue({group_id:selectedUserGroup.name});
            }else{
                setFieldsValue({group_id:selectedUserGroup.name});
                setFieldsValue({name:selectedRow.userName});
                setFieldsValue({leader:selectedRow.leader});
                setFieldsValue({role:selectedRow.role});
                setFieldsValue({status:selectedRow.status});
            }
        }*/
    }

    componentWillReceiveProps(nextProps) {
        const {result, errMessage, updateResult, updateErrors} = nextProps;
         //创建返回信息
         if (this.props.result != result && result) {
         this.insertCallback("新增成功");
         } else if (this.props.errMessage != errMessage && errMessage) {
         this.errCallback("新增失败",errMessage);
         }
         /*//修改返回信息
         if (this.props.updateResult != updateResult && updateResult) {
         this.insertCallback("修改成功");
         } else if (this.props.updateErrors != updateErrors && updateErrors) {
         this.errCallback("修改失败",updateErrors);
         }*/
    }

    handleChange(targetKeys){
        this.targetKeys = targetKeys;
    }

    render() {
        const {editType} = this.props.location.state;
        const {getFieldProps} = this.props.form;
        const {allUserInfo,allUserloading,userInfoData,selectedUserGroup} = this.props;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const targetKeys = (editType == 'add')?[]:(userInfoData.length==0?[]:userInfoData);
        let title = (editType == 'add')?(selectedUserGroup.name+'组新增人员'):(selectedUserGroup.name+'组删除人员')

        return(
            <Box title={title}>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="人员操作">
                        <TransferFilter {...getFieldProps('user_ids')}
                                        dataSource={allUserInfo}
                                        onChange={this.handleChange.bind(this)}
                                        targetKeys={targetKeys}
                                        loadingProMsg={allUserloading }/>
                    </FormItem>
                    <FormItem wrapperCol={{span: 10, offset: 10}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit"
                                loading={editType == 'add'?this.props.loading:this.props.updateLoading}
                                disabled={editType == 'add'?this.props.disabled:this.props.updateDisabled}>
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
        loginInfo:state.login.profile,
        userTreeData: state.getUserRelationTree.userTreeData,
        selectedUserGroup: state.getSelectNode.selectedUserGroup,
        userInfoData:state.getUserInfo.userInfoData,
        allUserInfo: state.getUserInfo.allUserInfo,
        allUserloading: state.getUserInfo.allUserloading,
        result: state.createUser.result,
         errMessage:state.createUser.errors,
         loading:state.createUser.loading,
         disabled:state.createUser.disabled,
         updateResult:state.createUser.updateResult,
         updateErrors:state.createUser.updateErrors,
         updateLoading:state.createUser.updateLoading,
         updateDisabled:state.createUser.updateDisabled,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllUserInfo:bindActionCreators(getAllUserInfo, dispatch),
        createUser:bindActionCreators(createUser, dispatch),
        getUserInfo:bindActionCreators(getUserInfo, dispatch),
        setUserDelete:bindActionCreators(setUserDelete, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAddModify);