/**
 * Created by helen on 2017/3/29.
 */
import React, {PropTypes,Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, message, Button, Tag, Card, Row, Col, Icon,Modal,Select,Upload,DatePicker,Menu,Dropdown} from 'antd';
import Box from '../../components/box';
import * as actions from './action';
import EditTask from './edit-task';
import ProjectConfirm from './project-confirm';
import './index.less';
import TaskGroup from './task-group';
import Task from './task';
import {DragDropContext, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


const FormItem = Form.Item;
const Option = Select.Option;
const SubMenu = Menu.SubMenu;

class TaskCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            uploadVisible:false,
            projectVisible:false,
            taskData:''
        };
    }

    componentWillMount() {
        this.props.actions.getTaskInfo(this.props.storyId);
    }

    componentWillReceiveProps(nextProps) {
        //回退任务
        const {rollBackInfo} = this.props;

        const {taskInfo,addResult} = nextProps;

        if(nextProps.rollBackInfo && rollBackInfo && !nextProps.rollBackInfo.loading && nextProps.rollBackInfo.result != rollBackInfo.result) {
                this.props.actions.getTaskInfo(this.props.storyId);
                message.success('回退成功');
        }

        //回退失败刷新
        if(nextProps.rollBackInfo && rollBackInfo && !nextProps.rollBackInfo.loading && nextProps.rollBackInfo.error != rollBackInfo.error) {
            this.props.actions.getTaskInfo(this.props.storyId);
        }


        if (taskInfo.setTaskDeveloper && !taskInfo.setTaskDeveloperLoading && taskInfo.setTaskDeveloper!=this.props.taskInfo.setTaskDeveloper) {
            this.props.actions.getTaskInfo(this.props.storyId);
            message.success('领取成功');
        }

        if (taskInfo.uploadTaskFile && !taskInfo.uploadTaskFileLoading && taskInfo.uploadTaskFile!=this.props.taskInfo.uploadTaskFile) {
            this.props.actions.getTaskInfo(this.props.storyId);
            message.success('上传成功');
        }

        if (taskInfo.deleteTask && !taskInfo.deleteTaskLoading && taskInfo.deleteTask!=this.props.taskInfo.deleteTask) {
            this.props.actions.getTaskInfo(this.props.storyId);
            message.success('删除成功');
        }

        if(taskInfo.designProject&&taskInfo.designProject!=this.props.taskInfo.designProject&&!taskInfo.designProjectLoading){
            this.props.actions.getTaskInfo(this.props.storyId);
            message.success('操作成功');
        }

        if ( addResult &&addResult!=this.props.addResult&&!addResult.getLoading&&!taskInfo.errors) {
            this.props.actions.getTaskInfo(this.props.storyId);
            message.success('提交成功');
        }
    }

    setModifyTask(flag,task,editType,e){
        if(e){
            e.stopPropagation();
        }

        this.setState({
            visible:flag,
            editType:editType,
            taskData:task
        });
    }


    modifyTaskDeveloper(taskId){
        const {loginInfo,actions} = this.props;
        actions.setTaskDeveloper(loginInfo.userId,taskId);
    }

    deleteTask(taskId){
        this.props.actions.deleteTask(this.props.loginInfo.userId,taskId);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form, loginInfo} = this.props;
        form.validateFields((errors) => {
                if (!!errors) {
                    return;
                } else {
                    this.setState({
                        modalVisible: false,
                    });
                }
            }
        )
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
        this.props.form.resetFields();
    }


    handleUpload() {
        const {actions,form,loginInfo} = this.props;
        form.setFieldsValue({'files':this.state.fileList});
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const data = form.getFieldsValue();
                data.operator_id=loginInfo.userId;
                data.id = this.state.taskId;
                //console.log(data);
                actions.submitTaskFile(data);
                this.setState({
                    uploadVisible: false,
                    fileList:null,
                });

                form.resetFields();
            }
        })
    }

    cancelUpload(){
        this.setState({
            uploadVisible: false,
            fileList:null,
        });
        this.props.form.resetFields();
    }


    setProjectVisible(flag,taskId, e){

        if(e){
            e.stopPropagation();
        }
        this.setState({
            projectVisible: flag,
            taskId:taskId
        });
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
        this.props.form.setFieldsValue({'files':this.state.fileList});
        return false;
    }


    handleClick(taskId,item) {
        const {loginInfo} = this.props;

        if (item.key == 'setting:2') {
            this.setState({
                uploadVisible: true,
                taskId:taskId
            });
        }else if(item.key == 'setting:3'){
            this.setProjectVisible(true, taskId);
        }else if(item.key == 'setting:1'){
            //回退卡片
            this.props.actions.rollBackCard(loginInfo.userId,taskId)
        }else if (item.key == 'pickupTask'){
            this.modifyTaskDeveloper(taskId);
        }else if (item.key == 'deleteTask'){
            this.deleteTask(taskId);
        }
    }

    moveTask(from, to){
        const taskInfo = this.props.taskInfo[to.storyId];
        if (to.type == 'DOING'){
            for (var i in taskInfo.todo_cards){
                if (taskInfo.todo_cards[i].id == from.id){
                    taskInfo.doing_cards.splice(taskInfo.doing_cards.length,0,taskInfo.todo_cards[i]);
                    taskInfo.todo_cards.splice(i, 1);
                    break;
                }
            }
            this.modifyTaskDeveloper(from.id);
        }else if (to.type == 'TODO'){
            for (var i in taskInfo.doing_cards){
                if (taskInfo.doing_cards[i].id == from.id){
                    taskInfo.todo_cards.splice(taskInfo.todo_cards.length,0,taskInfo.doing_cards[i]);
                    taskInfo.doing_cards.splice(i, 1);
                    break;
                }
            }
            this.props.actions.rollBackCard(this.props.loginInfo.userId, from.id);
        }
    }

    render(){

        const story = this.props.storyId;

        const taskInfo = this.props.taskInfo[story];

        const todoAction = function(self, taskId){
            return (
                <Menu onClick={self.handleClick.bind(self, taskId)}>
                    <Menu.Item key="pickupTask">领取任务</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="deleteTask">删除任务</Menu.Item>
                </Menu>
            );

        }

        const doingAction = function(self, taskId){
            return (
                <Menu onClick={self.handleClick.bind(self, taskId)} mode="horizontal">
                    <Menu.Item key="setting:1">回退任务</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="setting:2">提交文档</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="setting:3">选择项目</Menu.Item>
                </Menu>
            );
        }

        const todoTask = taskInfo&&taskInfo.todo_cards&&taskInfo.todo_cards.length?(
                taskInfo.todo_cards.map(
                    data =><Task key={data.id} id={data.id} storyId={story} type="TODO" moveTask={this.moveTask.bind(this)}>
                        <Row>
                            <Col span={22}>
                                <p><code className="todo"><a onClick={this.setModifyTask.bind(this,true,data,'modify')}>{data.title}</a></code></p>
                                {data.developer?<Tag>{data.developer.name}</Tag>:''}
                            </Col>
                            <Col span={2}>
                                <Dropdown overlay={todoAction(this, data.id)}>
                                    <a className="ant-dropdown-link">
                                        <Icon type="bars" />
                                    </a>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Task> )):"";

        const doingTask = taskInfo&&taskInfo.doing_cards&&taskInfo.doing_cards.length?(
                taskInfo.doing_cards.map(
                    data =>
                        <Task key={data.id} id={data.id} storyId={story} type="DOING" moveTask={this.moveTask.bind(this)}>
                            <Row>
                                <Col span={22}>
                                    <p><code className="doing"> <a onClick={this.setModifyTask.bind(this,true,data,'modify')}>{data.title}</a> </code></p>
                                    {data.developer?<Tag>{data.developer.name}</Tag>:''}
                                </Col>
                                <Col span={2}>
                                    <Dropdown overlay={doingAction(this, data.id)}>
                                        <a className="ant-dropdown-link">
                                            <Icon type="bars" />
                                        </a>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Task>)):"";

        const doneTask = taskInfo&&taskInfo.done_cards&&taskInfo.done_cards.length?(
                taskInfo.done_cards.map(
                    data =><Task key={data.id} id={data.id} storyId={story} type="DONE" moveTask={this.moveTask.bind(this)}>
                        <p><code className="done"> {data.title} </code></p>
                        {data.developer?<Tag>{data.developer.name}</Tag>:''}
                        {data.code_submit_date?new Date(parseInt(data.code_submit_date)).toLocaleDateString():''}
                    </Task> )):"";

        const action = (<Button size="small" onClick={this.setModifyTask.bind(this,true,null,'add')}>新建任务</Button>);

        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 12},
        };


        return (
            <div id="tasks">
                <Row>
                    <Col span="8">
                        <TaskGroup title={`待处理（${todoTask.length}）`} action={action} classType="bg" headerStyle={{backgroundColor:'#6AAAEA',color:'white'}} storyId={story} type="TODO">
                            {todoTask}
                        </TaskGroup>
                    </Col>
                    <Col span="8">
                        <TaskGroup title={`进行中（${doingTask.length}）`} classType="bg" headerStyle={{backgroundColor:'#6AAAEA',color:'white'}} storyId={story} type="DOING">
                            {doingTask}
                        </TaskGroup>
                    </Col>
                    <Col span="8">
                        <TaskGroup title={`已完成（${doneTask.length}）`} classType="bg" headerStyle={{backgroundColor:'#6AAAEA',color:'white'}} storyId={story} type="DONE">
                            {doneTask}
                        </TaskGroup>
                    </Col>
                </Row>

                <EditTask  taskData={this.state.taskData}
                           editType={this.state.editType}
                           visible={this.state.visible}
                           story_id={this.props.storyId}
                           setModifyTask={this.setModifyTask.bind(this)}
                />

                <ProjectConfirm
                    projectVisible={this.state.projectVisible}
                    taskId={this.state.taskId}
                    currentMilestoneMsg = {this.props.currentMilestoneMsg}
                    setProjectVisible={this.setProjectVisible.bind(this)}
                />

                <Modal title='上传文档'
                       visible={this.state.uploadVisible}
                       onOk={this.handleUpload.bind(this)}
                    //confirmLoading={this.props.deleteLoading}
                       onCancel={this.cancelUpload.bind(this)}

                >

                    <Form horizontal >
                        <FormItem {...formItemLayout}  label="文档上传" >
                            {getFieldDecorator('files',{rules:[{required:true,type:"array",message:'请上传文档'}]})(
                                <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>)}
                        </FormItem>
                    </Form>
                </Modal>



            </div>
        )
    }
}

TaskCard.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

TaskCard = Form.create()(TaskCard);

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        rollBackInfo: state.taskCard.rollBackInfo,
        taskInfo: state.taskCard,
        designProject: state.taskCard.designProject,
        addResult:state.taskCard.result,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions:bindActionCreators(actions,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DragDropContext(HTML5Backend)(TaskCard));