/**
 * Created by zhaojp on 2016/11/28.
 */

import React, {PropTypes,Component} from 'react';
import { Select ,Form ,Input, Button, Modal, message,Spin} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getTranspondMember,developTranspond} from './action';
import ConfirmList from './confirm-list';
import Box from '../../components/box';
import {getApproveList} from '../approve/actions/approve-action'
import * as home from '../home/actions/home-action';


const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
class DevelopTransPond extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    componentWillReceiveProps(nextProps) {
        const {confirmList,transpondResult} = nextProps
        if(this.props.confirmList != confirmList && confirmList) {
            const role = confirmList[0].role;
            let roleId = 20;
            if(role == 'developer'){
                roleId = 30;
            }
            this.props.getTranspondMemberAction(confirmList[0].set_id,'set',roleId)
        }
        if(this.props.transpondResult != transpondResult && transpondResult){
            this.insertCallback('需求转派成功');
        }
    }

    insertCallback(type){
        message.success(type);
        this.props.home.getNotifyItems(this.props.loginInfo.userId);
        this.props.getApproveListAction(this.props.loginInfo.username);
        this.context.router.goBack();
    }


    handleSubmit(e){
        e.preventDefault();
        const {form,confirmList,loginInfo} = this.props;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.pass = false;
                data.task_id = this.props.task_id;
                data.demand_id = confirmList[0].demand_id;
                data.role = confirmList[0].role;
                data.username = loginInfo.username;
                this.props.transpondAction(data)
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
                //do nothing
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const {transpondMember,transpondLoading, getConfirmListLoading,getTranspondMemberLoading} = this.props;
        const buttonLoading = transpondLoading? true: false;
        const memberSelectOption =  transpondMember?transpondMember.map(data => <Option key={data.id}>{data.name}</Option>):[];
        const dataLoading = getTranspondMemberLoading||getConfirmListLoading ?true: false;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        if(this.props.showTranspond) {
            return (
                <Box title="需求转派">
                    <Spin spinning={dataLoading} tip="正在加载数据，请稍候...">
                        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                            <FormItem {...formItemLayout} label="转派给">
                                {getFieldDecorator('assigned_id', {rules: [{required: true, message: '请选择要转派的人'}]})(
                                    <Select showSearch optionFilterProp="children" placeholder="请选择要转派的人">
                                    {memberSelectOption}
                                </Select>)}
                            </FormItem>

                            {/* <FormItem {...formItemLayout} label="说明">
                             {getFieldDecorator('description', {rules: [{required: true, message: '请填写转派说明'}]})
                             (<Input type="textarea" placeholder="请输入转派说明" rows="5"/>)}
                             </FormItem>
                             */}
                            <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                                <Button type="primary" htmlType="submit" loading={buttonLoading}>转派</Button>
                                <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                            </FormItem>

                        </Form>
                    </Spin>
                </Box>
            )
        }else{
            return null;
        }
    }
}


DevelopTransPond.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        getTranspondMemberLoading: state.toBeConfirmedItem.getTranspondMemberLoading,
        transpondMember: state.toBeConfirmedItem.transpondMember,
        transpondLoading: state.toBeConfirmedItem.transpondLoading,
        transpondResult: state.toBeConfirmedItem.transpondResult,
        getConfirmListLoading: state.toBeConfirmedItem.getConfirmListLoading,
        confirmList: state.toBeConfirmedItem.confirmList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getTranspondMemberAction: bindActionCreators(getTranspondMember, dispatch),
        transpondAction: bindActionCreators(developTranspond, dispatch),
        getApproveListAction: bindActionCreators(getApproveList, dispatch),
        home:bindActionCreators(home, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DevelopTransPond));
