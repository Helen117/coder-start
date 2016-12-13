/**
 * Created by Administrator on 2016-11-18.
 */
import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, notification,Modal,Select,Icon,Row,Col} from 'antd';
import 'pubsub-js';
import {UpdateUser,getAllUserInfo,AddEmail} from './actions/update-user-info-action';
import {findEmailByUserId} from './utils';
import styles from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

class UpdateBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            add_new_email:false,
        }
    }

    componentDidMount(){
        this.props.getAllUserInfo();
    }

    handleSubmit(e) {
        e.preventDefault();
        const { form,loginInfo,UpdateUser,AddEmail } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                if(formData.new_email){
                    //调添加邮箱接口
                    let email = formData.new_email+formData.option_add;
                    AddEmail(loginInfo.userId,email);
                }else{
                    //调修改成员信息接口
                    let data = {};
                    data.user_id = loginInfo.userId;
                    data.name = formData.name;
                    data.email = formData.email_0+formData.option_0;
                    UpdateUser(data);
                }
            }
        })
    }

    handleCancel() {
        const {form} = this.props;
        form.resetFields();
    }

    insertCallback(message){
        notification.success({
            message: message,
            description: '',
            duration: null
        });
        //调所有成员接口,更新邮箱信息
        this.props.getAllUserInfo();
    }

    componentWillReceiveProps(nextProps) {
        const {UserInfo,AddEmailInfo} = nextProps;
        const {visible} = this.props;
        //修改返回信息
        if(visible == true && this.props.UserInfo && UserInfo){
            if (this.props.UserInfo.updateResult != UserInfo.updateResult && UserInfo.updateResult) {
                this.insertCallback("修改成功");
            }
        }
        //添加邮箱返回信息
        if(this.props.AddEmailInfo && AddEmailInfo){
            if (this.props.AddEmailInfo.result != AddEmailInfo.result
                && AddEmailInfo.result) {
                this.insertCallback("添加邮箱成功");
            }
        }
    }

    checkEmail(rule, value, callback){
        var reg = /^[a-z0-9_\.\-]*$/;
        if (!value) {
            callback();
        } else {
            if (!reg.test(value)) {
                callback('请输入正确的邮箱！');
            } else {
                callback();
            }
        }
    }

    addNewEmail(){
        this.setState({
            add_new_email:!this.state.add_new_email
        })
    }

    render() {
        const {visible,loginInfo,AllUserInfo} = this.props;
        const {getFieldDecorator,getFieldError} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 8},
        };
        const formItemLayout_1 = {
            labelCol: {span: 5},
            wrapperCol: {span: 13},
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 13, offset: 5 },
        };
        const nameProps = getFieldDecorator('name',
            {rules:[
                {required:true, message:'请输入中文名！'},
            ],initialValue:loginInfo.name})(<Input type="text" placeholder="请输入中文名"/>);
        const addSelectAfter = getFieldDecorator('option_add',{initialValue:'@shpso.com'})(
            <Select style={{ width: 100 }} >
                <Option value="@shpso.com">@shpso.com</Option>
                <Option value="@boss.com">@boss.com</Option>
            </Select>
        );

        if(visible == true){
            let email_list=(<div></div>),selectAfter=(<div></div>);
            let email_array = [];
            if(AllUserInfo && AllUserInfo.allUserInfo){
                let initEmail = findEmailByUserId(loginInfo.userId,AllUserInfo.allUserInfo);
                email_array = initEmail.split(' , ');
                email_list = email_array.map((item,index)=>{
                    let _index = item.indexOf('@');
                    let _email = item.substr(0,_index);
                    let email_ = item.substr(_index+1,item.length);

                    selectAfter = getFieldDecorator(`option_${index}`,{initialValue:email_})(
                        <Select style={{ width: 100 }} >
                            <Option value="@shpso.com">@shpso.com</Option>
                            <Option value="@boss.com">@boss.com</Option>
                        </Select>
                    );
                    return (
                        <FormItem
                            {...(index === 0 ? formItemLayout_1 : formItemLayoutWithOutLabel)}
                            label={index === 0 ? '邮箱' : ''}
                            required={false}
                            key={index}
                        >
                            <Col span={15}>
                                {getFieldDecorator(`email_${index}`, {
                                    rules: [{
                                        required: true,
                                        whitespace: true,
                                        message: "邮箱",
                                    }],initialValue:_email}
                                )( <Input addonAfter={selectAfter}/> )}
                            </Col>
                        </FormItem>
                    );
                })
            }

            return(
                <div>
                    <Row style={{textAlign:'right'}}>
                        {email_array.length==0?(this.state.add_new_email?(
                            <Button onClick={this.addNewEmail.bind(this)}
                                    type="gost"
                            > 取消添加 </Button>
                        ):<Button onClick={this.addNewEmail.bind(this)}
                                  type="primary"
                        > 添加新邮箱 </Button>):<div></div>}
                    </Row>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        {this.state.add_new_email?(
                            <FormItem {...formItemLayout}  label="添加新邮箱" >
                            {getFieldDecorator('new_email',{rules:[{validator:this.checkEmail}]})(
                                <Input placeholder="邮箱" addonAfter={addSelectAfter}/>
                            )}
                        </FormItem>):(
                            <div>
                                <FormItem {...formItemLayout} label="中文名"
                                          help={getFieldError('name')?getFieldError('name'):"修改中文名后需刷新后才能获得认证！"}>
                                    {nameProps}
                                </FormItem>
                                {email_list}
                            </div>
                        )}
                        <FormItem wrapperCol={{span: 10, offset: 7}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit"
                                    loading={this.props.updateLoading}
                                    disabled={this.props.updateDisabled}>
                                确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>重置</Button>
                        </FormItem>
                    </Form>
                </div>
            )
        }else {return <div></div>}
    }
}

UpdateBasicInfo.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


UpdateBasicInfo = Form.create()(UpdateBasicInfo);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
        UserInfo:state.UpdateUserInfo.UserInfo,
        AllUserInfo:state.UpdateUserInfo.AllUserInfo,
        AddEmailInfo:state.UpdateUserInfo.AddEmailInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateUser:bindActionCreators(UpdateUser, dispatch),
        getAllUserInfo:bindActionCreators(getAllUserInfo, dispatch),
        AddEmail:bindActionCreators(AddEmail, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBasicInfo);