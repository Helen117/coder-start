/**
 * Created by Administrator on 2016-09-20.
 */
import React,{
    PropTypes,
    Component
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Form,Button,Modal,Select,notification,Table,message,Row,Col,Input} from 'antd';


const Option = Select.Option;
const FormItem = Form.Item;

class EditProjectMember extends Component {
    constructor(props) {
        super(props);
        this.editMemberRecord = {};
            this.state = {

            }
    }

    componentWillReceiveProps(nextProps) {
        const {setFieldsValue} = this.props.form;
        const {visible,record} = nextProps;
        if(visible && visible!=this.props.visible){
            setFieldsValue(record);
        }
    }

    insertCallback(messageInfo){

    }

    changeSelect(value){
        this.setState({
            accessLevel:value
        })
    }

    handleOk(){
        const {setVisible} = this.props;
        if(setVisible){
            setVisible(false)
        }
    }

    handleCancel(){
        const {setVisible} = this.props;
        if(setVisible){
            setVisible(false)
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14},
        };

        return (
            <Modal title="修改成员"
                   visible={this.props.visible}
                   onOk={this.handleOk.bind(this)}
                   onCancel={this.handleCancel.bind(this)}
            >
                <FormItem {...formItemLayout} label="姓名">
                    {getFieldDecorator('name')(
                        <Input disabled/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="角色">
                    {getFieldDecorator('role',{rules:[
                        {required:true, message:'请选择成员角色！'},
                    ]})(
                        <Select
                            style={{ width: '100%' }}
                            placeholder="请选择角色"
                            onChange={this.changeSelect.bind(this)}
                        >
                            <Option value="40">管理员</Option>
                            <Option value="30">开发者</Option>
                            <Option value="20">测试</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="邮箱">
                    {getFieldDecorator('email')(
                        <Input disabled/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="进入项目时间">
                    {getFieldDecorator('join_time')(
                        <Input disabled/>
                    )}
                </FormItem>
            </Modal>
        )
    }
}
EditProjectMember.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

EditProjectMember = Form.create()(EditProjectMember);

function mapStateToProps(state) {
    return {
        loginInfo:state.login.profile,
    }
}

function mapDispatchToProps(dispatch){
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditProjectMember);






