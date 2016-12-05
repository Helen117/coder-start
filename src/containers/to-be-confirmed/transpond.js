/**
 * Created by zhaojp on 2016/11/28.
 */

import React, {PropTypes,Component} from 'react';
import { Select ,Form ,Input, Button, Modal} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getTranspondMember,developTranspond} from './action'

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
class DevelopTransPond extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    componentWillMount() {
        const id = this.props.id
        //this.props.getTranspondMemberAction(id)
    }

    handleCancel(){

    }

    handleSubmit(e){
        e.preventDefault();
        const {form,logInfo } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                console.log(form.getFieldsValue());
                const formData = form.getFieldsValue();
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
                //router.goBack();
                form.resetFields();
            },
            onCancel() {
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        if(this.props.showTranspod) {
            return (
                /*   <Box title="需求转派">*/
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="转派给">
                        {getFieldDecorator('assigne', {rules: [{required: true, message: '请选择要转派的人'}]})
                        (<Select showSearch optionFilterProp="children" placeholder="请选择要转派的人">
                            <Option key="1">dfer</Option>
                            <Option key="2">222</Option>
                        </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="说明">
                        {getFieldDecorator('description', {rules: [{required: true, message: '请填写转派说明'}]})
                        (<Input type="textarea" placeholder="请输入转派说明" rows="5"/>)}
                    </FormItem>

                    <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit" loading={this.props.loading}
                                disabled={this.props.disabled}>转派</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
                /*</Box>*/
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
        loading: state.toBeConfirmedItem.loading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getTranspondMemberAction: bindActionCreators(getTranspondMember, dispatch),
        developTranspondAction: bindActionCreators(developTranspond, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DevelopTransPond));
