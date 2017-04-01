/**
 * Created by helen on 2017/3/29.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin,Row, Col} from 'antd';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getDeveloperInfo} from '../request/actions/request-action';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;

class EditTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentWillMount() {
        // console.log(this.props.visible);
        // if(this.props.taskData){
        //     const {setFieldsValue} = this.props.form;
        //     setFieldsValue(this.props.taskData);
        // }
        // this.setState({
        //     visible: this.props.visible,
        // });
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.visible);
        console.log(nextProps.visible);
        if(nextProps.visible&&nextProps.visible!=this.props.visible){
            this.setState({
                    visible: nextProps.visible,
                });
        }
        if(nextProps.taskData&&nextProps.taskData!=this.props.taskData){
            const {setFieldsValue} = this.props.form;
            setFieldsValue(nextProps.taskData);
        }
    }

    handleSubmit() {
        const {form, loginInfo} = this.props;
        form.validateFields((errors) => {
                if (!!errors) {
                    return;
                } else {
                    this.setState({
                        visible: false,
                    });
                    form.resetFields();
                }
            }
        )
    }

    handleCancel() {
        const {form} = this.props;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                this.setState({
                    visible: false,
                });
                form.resetFields();
            },
            onCancel() {
                //do nothing
            }
        })
    }

    beforeUpload(file){
        var len = file.name.length;
        // if (!(file.name.substr(len-4,4).toLowerCase() == '.doc')) {
        //     message.error('上传的需求文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
        //     return false;
        // }
        if(file.size/ 1024 / 1024 >10){
            message.error('文件大小不能超过10M',3);
            return false;
        }

        if(file.size==0){
            message.error('不能上传空文件',3);
            return false;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            this.setState({
                fileList:[{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: reader.result
                }]
            });
        }.bind(this);
        reader.readAsDataURL(file);
        return false;
    }
    
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 12},
        };

        console.log(this.state.visible);

        const {developerInfo} = this.props;

        // const {editType} = this.props.location.state;
        // const developer = developerInfo?developerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];
        return (
            <Modal title={this.props.editType == 'add' ? '新增' : '修改'}
                   visible={this.state.visible}
                   onOk={this.handleSubmit.bind(this)}
                //confirmLoading={this.props.deleteLoading}
                   onCancel={this.handleCancel.bind(this)}
            >
                <Form horizontal >
                    <FormItem {...formItemLayout} label="任务名称">
                        {getFieldDecorator('title',{rules:[{required:true,message:'不能为空'}]})(<Input placeholder=""  />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="任务描述">
                        {getFieldDecorator('description')(<Input type="textarea" placeholder="" rows="5" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="开发人员">
                        {getFieldDecorator('assignee_develop_id')(
                            <Select showSearch
                                    showArrow={false}
                                    placeholder="请选择开发人员"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    style={{width: 300}}
                            >
                                {/*{developer}*/}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="检查项">
                        {getFieldDecorator('checkRule')(<Input type="textarea" placeholder="输入检查项" rows="5" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="计划完成时间">
                        {getFieldDecorator('expect_due_date')(
                            <DatePicker style={{width: 300}}/>)
                        }
                    </FormItem>

                    <FormItem {...formItemLayout}  label="文档上传" >
                        {getFieldDecorator('files')(
                            <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}


EditTask.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

EditTask = Form.create()(EditTask);

//返回值表示的是需要merge进props的state
function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        taskInfo: state.request.taskInfo,
    };
}

function mapDispatchToProps(dispatch){
    return{
        getDeveloperInfo:bindActionCreators(getDeveloperInfo,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditTask);