/**
 * Created by helen on 2017/3/29.
 */
import React, {PropTypes,Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Tag, Card, Row, Col, Icon,Modal,Select,Upload,DatePicker,Menu} from 'antd';
import Box from '../../components/box';
import * as actions from './action';
import EditTask from './edit-task';
import ProjectConfirm from './project-confirm';


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

    deleteTask(){
        console.log("delete");
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

    }

    cancelUpload(){
        this.setState({
            uploadVisible: false,
        });
        this.props.form.resetFields();
    }


    setProjectVisible(flag,e){
        if(e){
            e.stopPropagation();
        }
        this.setState({
            projectVisible: flag,
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
        return false;
    }


    handleClick(item) {
        if (item.key == 'setting:2') {
            this.setState({
                uploadVisible: true,
            });
        }else if(item.key == 'setting:3'){
            this.setProjectVisible(true);
        }
    }
    render(){
        // console.log('taskInfo:',this.props.taskInfo);
        //
        // console.log('form:',this.props.form);

        const {taskInfo,developerInfo} = this.props;

        const todoTask = taskInfo&&taskInfo.todo_cards&&taskInfo.todo_cards.length?(
            taskInfo.todo_cards.map(
                data =><Card style={{marginBottom:"5px"}} key={data.id}>
                        <Row>
                            <Col span={22}>
                                {data.developer?<Tag>{data.developer.name}</Tag>:<Button type="primary" size="default" onClick={this.modifyTaskDeveloper.bind(this,data.id)}>领取</Button>}
                               <a onClick={this.setModifyTask.bind(this,true,data,'modify')}>{data.title}</a>
                            </Col>
                            <Col span={2}>
                                <Icon type="delete"  onClick={this.deleteTask.bind(this)}/>
                            </Col>
                        </Row>
                </Card> )):"";

        const doingTask = taskInfo&&taskInfo.doing_cards&&taskInfo.doing_cards.length?(
            taskInfo.doing_cards.map(
                data =>
                    <div style={{padding:"5px", border:'1px solid #e9e9e9'}} key={data.id}>
                    <Row>
                        <Col span={20}>
                            <Tag>{data.developer.name}</Tag> {data.title}
                        </Col>
                        <Col span={4}>
                            <Menu onClick={this.handleClick.bind(this)}
                                  mode="horizontal"
                                 >
                                <SubMenu title={<Icon type="bars"/>}>
                                    <Menu.Item key="setting:1">回退</Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="setting:2">提交文档</Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="setting:3">选择项目</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Col>
                    </Row>
                </div>)):"";

        const doneTask = taskInfo&&taskInfo.done_cards&&taskInfo.done_cards.length?(
            taskInfo.done_cards.map(
                data =><Card style={{marginBottom:"5px"}} key={data.id}>
                    <Tag>{data.developer.name}</Tag> {data.title}
                    </Card> )):"";

        const action = (<Button type="primary" size="default" onClick={this.setModifyTask.bind(this,true,null,'add')}>新建Task</Button>);

        const {getFieldDecorator, getFieldError} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 12},
        };

        // const developer = developerInfo?developerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return (
            <div>
                <Row>
                    <Col span="8">
                        <Box title="todo" action={action}>
                            {todoTask}
                        </Box>
                    </Col>
                    <Col span="8">
                        <Box title="doing">
                            {doingTask}
                        </Box>
                    </Col>
                    <Col span="8">
                        <Box title="done">
                            {doneTask}
                        </Box>
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
                            {getFieldDecorator('files')(
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
        taskInfo: state.taskCard.taskInfo,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions:bindActionCreators(actions,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TaskCard);