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
import {updateProjectMember,getProjectMembers} from './actions/project-member-action';


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
        const {updateMemberInfo,projectInfo} = this.props;

        if(visible && visible!=this.props.visible){
            setFieldsValue(record);
        }

        let project = projectInfo?(projectInfo.projectInfo?projectInfo.projectInfo:""):"";
        if(nextProps.updateMemberInfo && updateMemberInfo
            && nextProps.updateMemberInfo.result!=updateMemberInfo.result){
            this.props.getProjectMembers(project.id);
            message.success('修改成功');
        }
    }

    insertCallback(messageInfo){

    }

    changeSelect(value){
        this.setState({
            accessLevel:value
        })
    }

    getUserIdByemail(email,members){
        for(let i=0; i<members.length; i++){
            if(email == members[i].email){
                return members[i].id;
            }
        }
        return "";
    }

    handleOk(){
        const {form,projectMembers,setVisible,projectInfo} = this.props;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                let members = projectMembers?
                    (projectMembers.projectMembers?projectMembers.projectMembers:[]):[];
                let project = projectInfo?(projectInfo.projectInfo?projectInfo.projectInfo:""):"";
                const data = form.getFieldsValue();
                let id = this.getUserIdByemail(data.email,members);
                this.props.updateProjectMember(project.id,id,data.role);
                if(setVisible){
                    setVisible(false)
                }
            }
        })
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
        updateMemberInfo:state.projectMember.updateProjectMember,
        projectMembers:state.projectMember.getProjectMembers,
        projectInfo:state.project.getProjectInfo
    }
}

function mapDispatchToProps(dispatch){
    return{
        updateProjectMember:bindActionCreators(updateProjectMember, dispatch),
        getProjectMembers:bindActionCreators(getProjectMembers, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditProjectMember);






