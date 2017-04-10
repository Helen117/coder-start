/**
 * Created by helen on 2017/3/29.
 */
import React, { PropTypes, Component } from 'react';
import { Form, Input, Button, Select,message,Modal,Upload,DatePicker,Icon,notification,Spin,Row, Col,Radio } from 'antd';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getTaskDeveloper,addTask,getTaskInfo,updateTask} from './action';
import Box from '../../components/box';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
class EditTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        const {setFieldsValue} = this.props.form;
        const {taskData,editType,addResult,updateTaskResult,story_id,visible} = nextProps;

        if(taskData && editType=='modify' && !this.props.visible){
            taskData.due_date = taskData.due_date? moment(taskData.due_date):null;
            const developer = taskData.developer? taskData.developer.id.toString():null;
            setFieldsValue(taskData);
            setFieldsValue({"developer":developer});
        }

        if(visible && visible != this.props.visible){
            this.props.getTaskDeveloper(story_id);
        }

        if ( addResult &&addResult!=this.props.addResult) {
            this.props.getTaskInfo(this.props.story_id);
            message.success('提交成功');
        }

        if ( updateTaskResult && updateTaskResult!=this.props.updateTaskResult) {
            this.props.getTaskInfo(this.props.story_id);
            message.success('提交成功');
        }
    }

    handleSubmit() {
        const {form,taskData,loginInfo,addTaskAction,editType,story_id,updateTask} = this.props;
        const setModifyTask = this.props.setModifyTask;

        form.validateFields((errors) => {
                if (!!errors) {
                    return;
                } else {
                    const data =form.getFieldsValue();
                    var developer={};
                    if(data.developer){
                        developer.id=data.developer;
                    }
                    const taskInfo ={
                        title:data.title,
                        description:data.description,
                        check_items:data.check_items,
                        developer:developer,
                        type:'demand',
                        due_date:data.due_date? data.due_date.valueOf: null,
                        story_id:story_id,
                        is_active:data.is_active
                    };
                    if(editType=='add'){
                        taskInfo.creater={
                            id:loginInfo.userId
                        };
                        addTaskAction(taskInfo);
                    }else{
                        //console.log('update')
                        taskInfo.id=taskData.id;
                        taskInfo.operator_id = loginInfo.userId;
                        updateTask(taskInfo);
                    }

                    form.resetFields();
                    setModifyTask(false,taskData);
                }
            }
        )
    }

    handleCancel() {
        const {form,taskData} = this.props;
        const setModifyTask = this.props.setModifyTask;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                form.resetFields();
                setModifyTask(false,taskData);
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

        const {developerInfo} = this.props;

        // const {editType} = this.props.location.state;
        const developer = developerInfo?developerInfo.map(data => <Option key={data.userId}>{data.name}</Option>):[];
        return (
            <Modal title={this.props.editType == 'add' ? '新增' : '修改'}
                   visible={this.props.visible}
                   onOk={this.handleSubmit.bind(this)}
                //confirmLoading={this.props.deleteLoading}
                   onCancel={this.handleCancel.bind(this)}
            >
                <Form horizontal >
                    <FormItem {...formItemLayout} label="任务名称">
                        {getFieldDecorator('title',{rules:[{required:true,message:'不能为空'}]})(<Input placeholder=""  />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="任务描述">
                        {getFieldDecorator('description')(<Input type="textarea" placeholder="" rows="3" />)}
                    </FormItem>



                    <FormItem {...formItemLayout} label="开发人员">
                        {getFieldDecorator('developer')(
                            <Select showSearch
                                    showArrow={false}
                                    placeholder="请选择开发人员"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    allowClear={true}
                                    style={{width: 300}}
                            >
                                {developer}
                            </Select>)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="类型">
                        {getFieldDecorator('is_active',{initialValue:"true"})(
                            <RadioGroup>
                                <Radio value="true">主动领取</Radio>
                                <Radio value="false">被动指派</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="检查项">
                        {getFieldDecorator('check_items')(<Input type="textarea" placeholder="输入检查项" rows="3" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="计划完成时间">
                        {getFieldDecorator('due_date')(
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
        developerInfo:state.taskCard.userInfo,
        addResult:state.taskCard.result,
        updateTaskResult:state.taskCard.updateTask,
    };
}

function mapDispatchToProps(dispatch){
    return{
        getTaskDeveloper:bindActionCreators(getTaskDeveloper,dispatch),
        addTaskAction:bindActionCreators(addTask,dispatch),
        getTaskInfo:bindActionCreators(getTaskInfo,dispatch),
        updateTask:bindActionCreators(updateTask,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditTask);